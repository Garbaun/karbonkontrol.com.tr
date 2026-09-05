import { useEffect, useState } from 'react'
import { X, CheckCircle2, Mail, Inbox, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmissionInfoModalProps {
  open: boolean
  onClose: () => void
  userEmail: string | null
}

export default function SubmissionInfoModal({
  open,
  onClose,
  userEmail,
}: SubmissionInfoModalProps) {
  const [mounted, setMounted] = useState<boolean>(false)

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

  if (!open) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        mounted ? 'opacity-100' : 'opacity-0',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-info-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden touch-pan-y [-webkit-overflow-scrolling:touch]">
        <div className="min-h-[100dvh] w-full flex items-start sm:items-center justify-center px-3 py-4 sm:px-6 sm:py-10">
          <div
            className={cn(
              'relative w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-200/80 transition-all duration-300 transform my-auto',
              mounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0',
            )}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Top gradient + icon */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/70 px-4 pt-6 pb-5 sm:px-8 sm:pt-9 sm:pb-8">
              <div className="absolute -top-10 -right-10 sm:-top-14 sm:-right-14 h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
                  <div className="relative inline-flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 text-white">
                    <Sparkles className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                </div>

                <div className="mt-3 sm:mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-emerald-200/80 px-3 py-1.5 sm:px-3.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11.5px] sm:text-[13px] font-bold text-emerald-800 tracking-wide">
                    Form başarıyla alındı
                  </span>
                </div>

                <h2
                  id="submission-info-title"
                  className="mt-3 sm:mt-4 text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight"
                >
                  Raporunuz Hazırlanıyor
                </h2>

                <p className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold leading-relaxed text-slate-700 max-w-md">
                  SAIT Hesaplama işleminize başlıyor, detaylı analiziniz en kısa sürede
                  <span className="text-emerald-700"> e-posta adresinize </span>
                  ulaştırılacaktır.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-5 sm:px-8 sm:pt-7 sm:pb-7 space-y-3.5 sm:space-y-5">
              {/* Spam / Inbox uyarısı kutusu */}
              <div className="relative flex gap-2.5 sm:gap-3.5 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-amber-50/80 to-yellow-50 px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
                <div className="shrink-0 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Inbox className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                  <p className="text-[13.5px] sm:text-sm font-bold text-amber-900 leading-snug">
                    Gelen Kutusu ve Spam Kontrolü
                  </p>
                  <p className="text-[12.5px] sm:text-[13.5px] leading-relaxed text-amber-900/90">
                    Lütfen gelen kutunuzu (Inbox) ve <b>Spam / Önemsiz</b> klasörünüzü
                    kontrol edin. Mailin aksamadan ulaşması için{' '}
                    <a
                      href="mailto:info@karbonkontrol.com.tr"
                      className="font-bold underline decoration-dotted underline-offset-4 hover:text-amber-950 hover:decoration-solid transition-colors break-words"
                    >
                      info@karbonkontrol.com.tr
                    </a>{' '}
                    adresini güvenli gönderen listenize eklemenizi rica ederiz.
                  </p>
                </div>
              </div>

              {/* E-posta kutusu */}
              <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
                <div className="shrink-0 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Mail className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-[12.5px] font-bold uppercase tracking-wider text-slate-500">
                    Rapor Gönderilecek Adres
                  </p>
                  <p
                    className="mt-0.5 text-[14px] sm:text-[15.5px] font-bold text-slate-900 break-all hyphens-auto"
                    title={userEmail || ''}
                  >
                    {userEmail || '—'}
                  </p>
                </div>
              </div>

              {/* Tek buton: Tamam, Anladım */}
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 px-5 py-3 sm:px-6 sm:py-3.5 text-[15px] sm:text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 hover:brightness-105 hover:shadow-emerald-600/35 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40 transition-all duration-200"
              >
                <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                Tamam, Anladım
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
