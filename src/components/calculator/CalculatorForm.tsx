import { useState } from 'react'
import { Calculator, ShieldCheck } from 'lucide-react'
import {
  FormData,
  Sektor,
  CalisanAraligi,
  ElektrikAraligi,
  YakitTipi,
  TuketimAraligi,
  IhracatAraligi,
  SEKTOR_LABELS,
  CALISAN_ARALIK_LABELS,
  ELEKTRIK_ARALIK_LABELS,
  YAKIT_TIPI_LABELS,
  TUKETIM_ARALIK_LABELS,
  calculateCbamRisk,
} from '@/lib/cbamRisk'
import { sendCbamSubmission, RECAPTCHA_SITEKEY } from '@/lib/n8nCbam'

interface CalculatorFormProps {
  onResult: (userEmail: string) => void
}

type FormErrors = Partial<Record<keyof FormData, string>>

const BRAND = '#004f4f'

const inputCls =
  'w-full rounded-xl border border-white/90 bg-white px-4 py-3 text-sm font-medium outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#004f4f] focus:ring-4 focus:ring-white/20 shadow-sm'

const labelCls = 'block mb-2 text-sm font-semibold text-[#004f4f]'

const selectCls = (hasError: boolean) =>
  `${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23004f4f%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_1rem_center] pr-10 ${
    hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
  }`

export default function CalculatorForm({ onResult }: CalculatorFormProps) {
  const [form, setForm] = useState<FormData>({
    firmaAdi: '',
    email: '',
    sektor: '',
    calisanAraligi: '',
    elektrikAraligi: '',
    yakitTipi: '',
    tuketimAraligi: '',
    ihracatAraligi: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.firmaAdi.trim()) newErrors.firmaAdi = 'Firma adı zorunludur.'
    if (!form.email.trim()) {
      newErrors.email = 'E-posta adresi zorunludur.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin.'
    }
    if (!form.sektor) newErrors.sektor = 'Sektör seçimi zorunludur.'
    if (!form.calisanAraligi) newErrors.calisanAraligi = 'Çalışan sayısı seçimi zorunludur.'
    if (!form.elektrikAraligi) newErrors.elektrikAraligi = 'Elektrik tüketimi seçimi zorunludur.'
    if (!form.yakitTipi) newErrors.yakitTipi = 'Yakıt tipi seçimi zorunludur.'
    if (form.yakitTipi !== 'yok' && !form.tuketimAraligi) {
      newErrors.tuketimAraligi = 'Tüketim aralığı seçimi zorunludur.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function getRecaptchaToken(action = 'submit'): Promise<string | null> {
    const MAX_WAIT_MS = 8000
    const START = Date.now()
    while (!window.grecaptcha?.enterprise?.execute) {
      if (Date.now() - START > MAX_WAIT_MS) return null
      await new Promise((r) => setTimeout(r, 80))
    }
    try {
      const enterprise = window.grecaptcha.enterprise
      if (typeof enterprise.ready === 'function') {
        await Promise.resolve(enterprise.ready(() => undefined))
      }
      const token = await Promise.resolve(
        enterprise.execute(RECAPTCHA_SITEKEY, { action }),
      )
      return token || null
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[recaptcha] execute hatası:', err)
      }
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || submitting) return
    const riskLevel = calculateCbamRisk(
      form.sektor,
      (form.ihracatAraligi as IhracatAraligi | '') || 'under_1m',
    )
    setRecaptchaError(null)
    try {
      setSubmitting(true)
      const token = await getRecaptchaToken('cbam_submit')
      if (!token) {
        setRecaptchaError(
          'reCAPTCHA doğrulaması tamamlanamadı. Lütfen birkaç saniye sonra tekrar deneyin.',
        )
      }
      await sendCbamSubmission(form, riskLevel, {
        debug: import.meta.env.DEV,
        recaptchaToken: token || undefined,
      })
    } catch (_err) {
      if (import.meta.env.DEV) {
        console.error('[cbam] n8n submission failed (non-blocking):', _err)
      }
    } finally {
      setSubmitting(false)
    }
    onResult(form.email || '')
  }

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const textStyle = { color: BRAND } as React.CSSProperties

  return (
    <section id="calculator" className="section-padding !px-0">
      <div
        data-reveal
        className="grid grid-cols-1 lg:grid-cols-2 w-full border-y border-slate-200/60 shadow-[0_20px_60px_-20px_rgba(15,81,50,0.18)] overflow-hidden"
        style={{ minHeight: '560px' }}
      >
          {/* SOL: Yazılar (arka plan beyaz, yazı rengi #004f4f) */}
          <div
            className="bg-white px-8 md:px-10 lg:px-12 py-10 md:py-14 flex flex-col justify-center"
            data-reveal
            data-delay="0.05"
          >
            <h2
              className="text-[clamp(1.4rem,4.2vw,2rem)] sm:text-3xl md:text-4xl font-extrabold leading-[1.15] md:leading-tight tracking-tight mb-5 md:mb-8 break-words hyphens-auto overflow-x-clip"
              style={textStyle}
            >
              CBAM Karbon Ayak İzi Hesaplama Motoru:{' '}
              <span className="whitespace-nowrap inline-block">SAIT</span>
              <br className="hidden sm:block" />
              <span className="inline-block break-words">
                (Sustainable Artificial Intelligence Tool)
              </span>
            </h2>
            <div className="space-y-4 md:space-y-5 min-w-0">
              <p
                className="text-base md:text-xl font-bold leading-relaxed break-words overflow-x-clip"
                style={textStyle}
              >
                Sürekli Öğrenen ve Kendini Güncelleyen Yapay Zeka Altyapısı
              </p>
              <p className="text-base md:text-lg leading-relaxed font-medium" style={textStyle}>
                KarbonKontrol’ün CBAM Hesaplama Motoru, AWS Partner bulut altyapısında eğitilen ve
                özel olarak geliştirilen SAIT (Sustainable Artificial Intelligence Tool) yapay zeka
                mimarisine dayanmaktadır. Geleneksel ve statik hesaplama araçlarının aksine SAIT;
                uluslararası emisyon kütüphanelerini, dinamik katsayı değişikliklerini ve mevzuat
                güncellemelerini anlık olarak işleyerek kendini sürekli eğiten ve optimize eden
                akıllı bir analitik motorudur.
              </p>
            </div>
          </div>

          {/* SAĞ: Form (arka plan #004f4f) */}
          <div
            className="px-6 sm:px-8 md:px-10 py-8 md:py-10 lg:py-12 flex flex-col justify-center"
            style={{ backgroundColor: BRAND }}
            data-reveal
            data-delay="0.1"
          >
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 max-w-2xl w-full mx-auto">
              {/* 1. Firma + 2. E-posta (aynı satır) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="firmaAdi" className={labelCls} style={{ color: BRAND }}>
                    1. Firma adı
                  </label>
                  <input
                    id="firmaAdi"
                    type="text"
                    className={`${inputCls} ${
                      errors.firmaAdi ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                    style={{ color: BRAND }}
                    placeholder="Firma adını yazın..."
                    value={form.firmaAdi}
                    onChange={(e) => handleChange('firmaAdi', e.target.value)}
                  />
                  {errors.firmaAdi && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">{errors.firmaAdi}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className={labelCls} style={{ color: BRAND }}>
                    2. Kurumsal E-posta
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`${inputCls} ${
                      errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                    style={{ color: BRAND }}
                    placeholder="firma@kurumsal.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* 3. Sektör + 4. Çalışan (aynı satır) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="sektor" className={labelCls} style={{ color: BRAND }}>
                    3. Sektör seçin (CBAM riskli)
                  </label>
                  <select
                    id="sektor"
                    className={selectCls(!!errors.sektor)}
                    style={{ color: BRAND }}
                    value={form.sektor}
                    onChange={(e) => handleChange('sektor', e.target.value as Sektor | '')}
                  >
                    <option value="">Sektör seçiniz...</option>
                    {Object.entries(SEKTOR_LABELS).map(([key, label]) => (
                      <option key={key} value={key} style={{ color: BRAND }}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.sektor && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">{errors.sektor}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="calisan" className={labelCls} style={{ color: BRAND }}>
                    4. Çalışan sayısı
                  </label>
                  <select
                    id="calisan"
                    className={selectCls(!!errors.calisanAraligi)}
                    style={{ color: BRAND }}
                    value={form.calisanAraligi}
                    onChange={(e) =>
                      handleChange('calisanAraligi', e.target.value as CalisanAraligi | '')
                    }
                  >
                    <option value="">Çalışan sayısı seçiniz...</option>
                    {Object.entries(CALISAN_ARALIK_LABELS).map(([key, label]) => (
                      <option key={key} value={key} style={{ color: BRAND }}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.calisanAraligi && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">
                      {errors.calisanAraligi}
                    </p>
                  )}
                </div>
              </div>

              {/* 5. Elektrik Tüketimi (tek satır) */}
              <div>
                <label htmlFor="elektrik" className={labelCls} style={{ color: BRAND }}>
                  5. Elektrik Tüketimi
                </label>
                <select
                  id="elektrik"
                  className={selectCls(!!errors.elektrikAraligi)}
                  style={{ color: BRAND }}
                  value={form.elektrikAraligi}
                  onChange={(e) =>
                    handleChange('elektrikAraligi', e.target.value as ElektrikAraligi | '')
                  }
                >
                  <option value="">Elektrik tüketimi seçiniz...</option>
                  {Object.entries(ELEKTRIK_ARALIK_LABELS).map(([key, label]) => (
                    <option key={key} value={key} style={{ color: BRAND }}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.elektrikAraligi && (
                  <p className="mt-1.5 text-xs text-red-200 font-medium">
                    {errors.elektrikAraligi}
                  </p>
                )}
              </div>

              {/* 6. Yakıt Tipi + 7. Tüketim (aynı satır) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="yakit" className={labelCls} style={{ color: BRAND }}>
                    6. Yakıt Tipi
                  </label>
                  <select
                    id="yakit"
                    className={selectCls(!!errors.yakitTipi)}
                    style={{ color: BRAND }}
                    value={form.yakitTipi}
                    onChange={(e) => {
                      const val = e.target.value as YakitTipi | ''
                      handleChange('yakitTipi', val)
                      if (val === 'yok') handleChange('tuketimAraligi', '')
                    }}
                  >
                    <option value="">Yakıt tipi seçiniz...</option>
                    {Object.entries(YAKIT_TIPI_LABELS).map(([key, label]) => (
                      <option key={key} value={key} style={{ color: BRAND }}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.yakitTipi && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">{errors.yakitTipi}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="tuketim" className={labelCls} style={{ color: BRAND }}>
                    7. Tüketim
                  </label>
                  <select
                    id="tuketim"
                    className={selectCls(!!errors.tuketimAraligi)}
                    style={{ color: BRAND }}
                    disabled={form.yakitTipi === 'yok'}
                    value={form.tuketimAraligi}
                    onChange={(e) =>
                      handleChange('tuketimAraligi', e.target.value as TuketimAraligi | '')
                    }
                  >
                    <option value="">Tüketim seçiniz...</option>
                    {Object.entries(TUKETIM_ARALIK_LABELS).map(([key, label]) => (
                      <option key={key} value={key} style={{ color: BRAND }}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.tuketimAraligi && (
                    <p className="mt-1.5 text-xs text-red-200 font-medium">
                      {errors.tuketimAraligi}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit + reCAPTCHA */}
              <div className="pt-3 flex flex-col items-stretch gap-3">
                {recaptchaError && (
                  <div
                    className="inline-flex items-start gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white"
                    role="alert"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
                    <span>{recaptchaError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-bold shadow-lg shadow-black/10 hover:brightness-95 active:scale-[0.99] disabled:opacity-80 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200"
                  style={{ color: BRAND }}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-700 opacity-90" />
                  <Calculator className="w-5 h-5" />
                  {submitting ? 'Doğrulanıyor…' : 'Karbon Ayak İzini Hesapla'}
                </button>
                <p className="text-center text-xs text-white/80 font-medium leading-relaxed">
                  Bu form Google reCAPTCHA Enterprise ile korunmaktadır.
                  <br className="sm:hidden" />
                  <span className="opacity-90">
                    Gönderdiğiniz bilgiler{' '}
                    <a
                      href="https://policies.google.com/privacy?hl=tr"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-dotted underline-offset-4 hover:text-white hover:decoration-solid transition-colors"
                    >
                      Google Gizlilik Şartları
                    </a>{' '}
                    ve{' '}
                    <a
                      href="https://policies.google.com/terms?hl=tr"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-dotted underline-offset-4 hover:text-white hover:decoration-solid transition-colors"
                    >
                      Kullanım Şartları
                    </a>{' '}
                    tabiidir.
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
    </section>
  )
}
