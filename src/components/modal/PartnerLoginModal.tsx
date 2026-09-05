import { useEffect, useState } from 'react'
import { X, Lock, Building2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PartnerLoginModalProps {
  open: boolean
  onClose: () => void
}

type FormErrors = {
  companyId?: string
  password?: string
  submit?: string
}

const BRAND_DARK = '#004f4f'
const ERROR_RED = '#b91c1c'

export default function PartnerLoginModal({ open, onClose }: PartnerLoginModalProps) {
  const [companyId, setCompanyId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setCompanyId('')
      setPassword('')
      setRemember(true)
      setShowPwd(false)
      setErrors({})
    }
  }, [open])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!companyId.trim()) {
      e.companyId = 'Company ID boş geçilemez.'
    }
    if (!password.trim()) {
      e.password = 'Şifre boş geçilemez.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Kullanıcı istenildiği gibi: DIRECT giriş butonu hata versin (doğru girse bile demo girişi devre dışı)
    setErrors({
      submit:
        'Giriş başarısız. Partner panel erişiminiz henüz aktif değil. Bilgi için: info@karbonkontrol.com.tr',
    })
  }

  const inputCls = (hasErr: boolean) =>
    cn(
      'w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium outline-none transition-all duration-200',
      'placeholder:text-slate-400 focus:ring-4 shadow-sm',
      hasErr
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
        : `border-slate-200 focus:ring-emerald-500/10`,
    )

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Partner Girişi"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl shadow-slate-900/25 border border-slate-200/70 overflow-hidden">
        {/* Header */}
        <div
          className="relative flex items-start justify-between px-6 pt-6 pb-4"
          style={{ backgroundColor: BRAND_DARK }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Partner Paneli
            </p>
            <h3 className="mt-1 text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Kullanıcı Bilgileri
            </h3>
            <p className="mt-1 text-sm text-white/75 font-medium">
              Kurumsal giriş bilgilerinizle oturum açın.
            </p>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 py-5">
          {/* Company ID */}
          <div>
            <label htmlFor="companyId" className="block mb-1.5 text-sm font-bold text-slate-800">
              Company ID
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Building2 className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </span>
              <input
                id="companyId"
                type="text"
                autoComplete="username"
                placeholder="Firma Kimlik Kodunuzu Girin"
                className={`${inputCls(!!errors.companyId)} pl-11`}
                style={{ color: BRAND_DARK }}
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value)
                  if (errors.companyId || errors.submit) {
                    setErrors((p) => ({ ...p, companyId: undefined, submit: undefined }))
                  }
                }}
              />
            </div>
            {errors.companyId && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold" style={{ color: ERROR_RED }}>
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {errors.companyId}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-bold text-slate-800">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock style={{ width: 18, height: 18 }} />
              </span>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Şifrenizi Girin"
                className={`${inputCls(!!errors.password)} pl-11 pr-11`}
                style={{ color: BRAND_DARK }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password || errors.submit) {
                    setErrors((p) => ({ ...p, password: undefined, submit: undefined }))
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label={showPwd ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 16, height: 16 }}
                >
                  {showPwd ? (
                    <>
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.8 19.8 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold" style={{ color: ERROR_RED }}>
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember + Submit error */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'inline-flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200',
                  remember
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-900/20'
                    : 'bg-white border-slate-300 hover:border-slate-400',
                )}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                  style={{ opacity: remember ? 1 : 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Cihaza Güven
              </span>
            </label>
          </div>

          {errors.submit && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <AlertTriangle className="w-4.5 h-4.5 mt-0.5 shrink-0" style={{ width: 18, height: 18, color: ERROR_RED }} />
              <p className="text-sm font-semibold leading-relaxed" style={{ color: ERROR_RED }}>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-extrabold text-white shadow-lg shadow-emerald-900/15 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-emerald-900/20 active:scale-[0.99]"
              style={{ backgroundColor: BRAND_DARK }}
            >
              <Lock className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              Giriş Yap
            </button>
          </div>

          {/* Footer help */}
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Şifrenizi mi unuttunuz?{' '}
              <a
                href="mailto:info@karbonkontrol.com.tr"
                className="font-bold underline underline-offset-2 hover:no-underline"
                style={{ color: BRAND_DARK }}
              >
                İletişime Geç
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
