import { useEffect, useState, type FormEvent } from 'react'
import {
  X,
  Building2,
  Mail,
  Phone,
  Zap,
  Flame,
  Send,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RECAPTCHA_SITEKEY } from '@/lib/n8nCbam'
import {
  sendPricingInquiry,
  ELEKTRIK_ARALIKLARI,
  YAKIT_TURLERI,
  type PricingPackage,
} from '@/lib/n8nCbam'
import type { ElektrikAraligi, YakitTipi } from '@/lib/cbamRisk'

interface PackageInquiryModalProps {
  open: boolean
  onClose: () => void
  selectedPackage: PricingPackage | null
}

type FormState = {
  companyName: string
  authorizedName: string
  email: string
  phone: string
  elektrikAraligi: ElektrikAraligi | ''
  yakitTipi: YakitTipi | ''
}

type Errors = Partial<Record<keyof FormState, string>>

const INITIAL_FORM: FormState = {
  companyName: '',
  authorizedName: '',
  email: '',
  phone: '',
  elektrikAraligi: '',
  yakitTipi: '',
}

export default function PackageInquiryModal({
  open,
  onClose,
  selectedPackage,
}: PackageInquiryModalProps) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      setMounted(false)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setForm(INITIAL_FORM)
        setErrors({})
        setSubmitting(false)
        setDone(false)
        setRecaptchaError(null)
      }, 320)
      return () => window.clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const packageTitle = selectedPackage?.title ?? 'Paket'
  const packageBadge =
    selectedPackage?.eyebrow +
    (selectedPackage?.featured && selectedPackage?.badge ? ` · ${selectedPackage.badge}` : '')

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.companyName.trim()) e.companyName = 'Firma adını giriniz.'
    else if (form.companyName.trim().length < 2) e.companyName = 'Firma adı çok kısa.'
    if (!form.authorizedName.trim()) e.authorizedName = 'Yetkili adı soyadı giriniz.'
    else if (form.authorizedName.trim().length < 3) e.authorizedName = 'Yetkili adı soyadı çok kısa.'
    if (!form.email.trim()) e.email = 'E-posta adresini giriniz.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Geçerli bir e-posta adresi giriniz.'
    if (!form.phone.trim()) e.phone = 'Telefon numarasını giriniz.'
    else if (form.phone.replace(/[^\d+]/g, '').length < 7)
      e.phone = 'Geçerli bir telefon numarası giriniz.'
    if (!form.elektrikAraligi) e.elektrikAraligi = 'Lütfen bir elektrik aralığı seçiniz.'
    if (!form.yakitTipi) e.yakitTipi = 'Lütfen bir yakıt tipi seçiniz.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const getRecaptchaToken = async (action: string): Promise<string | null> => {
    try {
      const w = window as unknown as {
        grecaptcha?: {
          enterprise?: {
            ready?: (fn: () => Promise<string>) => Promise<string>
            execute?: (sitekey: string, opts: { action: string }) => Promise<string>
          }
        }
      }
      const grecaptcha = w.grecaptcha?.enterprise
      if (!grecaptcha || !grecaptcha.execute) {
        setRecaptchaError('reCAPTCHA yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.')
        return null
      }
      if (grecaptcha.ready) {
        return await grecaptcha.ready(async () => {
          return await (grecaptcha.execute?.(RECAPTCHA_SITEKEY, { action }) ?? Promise.resolve(''))
        })
      }
      return (await grecaptcha.execute?.(RECAPTCHA_SITEKEY, { action })) ?? null
    } catch (err) {
      setRecaptchaError('reCAPTCHA doğrulanamadı. Lütfen tekrar deneyin.')
      return null
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting || done) return
    setRecaptchaError(null)
    if (!validate()) return
    if (!selectedPackage) return
    setSubmitting(true)

    const recaptchaToken = await getRecaptchaToken('pricing_submit')
    if (!recaptchaToken) {
      setSubmitting(false)
      return
    }

    try {
      const result = await sendPricingInquiry(form, selectedPackage, {
        debug: import.meta.env.DEV,
        recaptchaToken,
      })
      if (!result.ok) {
        setRecaptchaError(
          'Teklif talebiniz gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
        )
        return
      }
      setDone(true)
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[pricing] webhook hatası', err)
      setRecaptchaError(
        'Teklif talebiniz gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const closeDone = () => {
    setDone(false)
    onClose()
  }

  const fieldCls = (key: keyof FormState) =>
    cn(
      'block w-full rounded-xl border-2 bg-white text-slate-900 placeholder-slate-400 px-3.5 py-2.5 text-sm font-semibold outline-none transition-all duration-200 shadow-sm',
      errors[key]
        ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
        : 'border-slate-200 focus:border-[#004f4f] focus:ring-4 focus:ring-emerald-100/80',
    )

  return (
    <div
      className={cn('fixed inset-0 z-50 transition-opacity duration-300', mounted ? 'opacity-100' : 'opacity-0')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-inquiry-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={done ? closeDone : onClose}
        aria-hidden="true"
      />

      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden touch-pan-y [-webkit-overflow-scrolling:touch]">
        <div className="min-h-[100dvh] w-full flex items-start sm:items-center justify-center px-3 py-4 sm:px-6 sm:py-10">
          <div
            className={cn(
              'relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-200/80 transition-all duration-300 transform my-auto',
              mounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0',
            )}
          >
            <button
              type="button"
              onClick={done ? closeDone : onClose}
              aria-label="Kapat"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Başlık alanı */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/70 px-4 pt-6 pb-5 sm:px-8 sm:pt-9 sm:pb-8">
              <div className="absolute -top-10 -right-10 sm:-top-14 sm:-right-14 h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-emerald-200/80 px-3 py-1.5 mb-2.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11.5px] sm:text-[12.5px] font-bold text-emerald-800 tracking-wide">
                      {packageBadge}
                    </span>
                  </div>
                  <h2
                    id="pricing-inquiry-title"
                    className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight"
                  >
                    {done ? 'Teklif Talebiniz Alındı' : `${packageTitle} · Teklif Talebi`}
                  </h2>
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold leading-relaxed text-slate-700 max-w-xl">
                    {done
                      ? 'Uzman ekibimiz en kısa sürede size özel fiyat teklifinizi e-posta ve telefon ile iletecektir.'
                      : 'Aşağıdaki bilgileri doldurun, size özel Karbon & CBAM teklifini hazırlayalım.'}
                  </p>
                </div>
              </div>
            </div>

            {/* İçerik */}
            {done ? (
              <div className="px-4 pt-5 pb-5 sm:px-8 sm:pt-7 sm:pb-7 space-y-4">
                <div className="flex gap-3.5 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-4 shadow-sm">
                  <div className="shrink-0 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-100 text-[#004f4f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-emerald-900 leading-snug">
                      Talebiniz #KK{Math.floor(10000 + Math.random() * 90000)} ile kaydedildi
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-emerald-900/85">
                      Lütfen e-posta gelen kutunuzu ve <b>Spam / Önemsiz</b> klasörünüzü kontrol edin.{' '}
                      <a
                        href="mailto:info@karbonkontrol.com.tr"
                        className="font-bold underline decoration-dotted underline-offset-4 hover:decoration-solid"
                      >
                        info@karbonkontrol.com.tr
                      </a>{' '}
                      adresini güvenli gönderenlerinize ekleyebilirsiniz.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDone}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#004f4f] to-emerald-700 px-5 py-3 text-[15px] sm:text-base font-extrabold text-[#ffffd9] shadow-lg shadow-emerald-900/20 hover:brightness-110 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40 transition-all duration-200"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Tamam, Anladım
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="px-4 pt-5 pb-5 sm:px-8 sm:pt-7 sm:pb-7 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#004f4f]" /> Firma Adı
                    </span>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="Örn: ABC Metal San. A.Ş."
                      className={fieldCls('companyName')}
                      autoComplete="organization"
                    />
                    {errors.companyName && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.companyName}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#004f4f]" /> E-posta
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="firma@ornek.com"
                      className={fieldCls('email')}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <UserRound className="w-3.5 h-3.5 text-[#004f4f]" /> Yetkili Adı Soyadı
                    </span>
                    <input
                      type="text"
                      value={form.authorizedName}
                      onChange={(e) => setForm({ ...form, authorizedName: e.target.value })}
                      placeholder="Ad Soyad"
                      className={fieldCls('authorizedName')}
                      autoComplete="name"
                    />
                    {errors.authorizedName && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.authorizedName}
                      </p>
                    )}
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#004f4f]" /> Telefon Numarası
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+90 555 123 4567"
                      className={fieldCls('phone')}
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#004f4f]" /> Yıllık Elektrik Tüketimi
                    </span>
                    <select
                      value={form.elektrikAraligi}
                      onChange={(e) => setForm({ ...form, elektrikAraligi: e.target.value as ElektrikAraligi | '' })}
                      className={cn(fieldCls('elektrikAraligi'), 'pr-10 cursor-pointer')}
                    >
                      <option value="">Seçiniz</option>
                      {ELEKTRIK_ARALIKLARI.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                    {errors.elektrikAraligi && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.elektrikAraligi}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#004f4f]" /> Ana Yakıt Tipi
                    </span>
                    <select
                      value={form.yakitTipi}
                      onChange={(e) => setForm({ ...form, yakitTipi: e.target.value as YakitTipi | '' })}
                      className={cn(fieldCls('yakitTipi'), 'pr-10 cursor-pointer')}
                    >
                      <option value="">Seçiniz</option>
                      {YAKIT_TURLERI.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                    {errors.yakitTipi && (
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.yakitTipi}
                      </p>
                    )}
                  </label>
                </div>

                {recaptchaError && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50 px-4 py-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-[13.5px] font-semibold text-rose-800 leading-snug">{recaptchaError}</p>
                  </div>
                )}

                <p className="text-[12px] leading-snug text-slate-500">
                  Bu form reCAPTCHA Enterprise ile korunmaktadır. Gönder butonuna tıklayarak{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-slate-700"
                  >
                    Gizlilik
                  </a>{' '}
                  ve{' '}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-slate-700"
                  >
                    Şartlar
                  </a>{' '}
                  nı kabul etmiş olursunuz.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[15px] sm:text-base font-extrabold shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-4',
                    submitting
                      ? 'bg-slate-400 text-white cursor-wait shadow-slate-500/20'
                      : 'bg-[#004f4f] text-[#ffffd9] shadow-emerald-900/20 hover:brightness-110 active:scale-[0.99] focus-visible:ring-emerald-400/40',
                  )}
                >
                  <Send className={cn('w-5 h-5 transition-transform', submitting && 'animate-pulse')} />
                  {submitting ? 'Gönderiliyor…' : 'Teklif Talebimi Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
