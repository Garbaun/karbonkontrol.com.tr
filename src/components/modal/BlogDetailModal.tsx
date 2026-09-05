import { useEffect } from 'react'
import { X, CalendarDays, Clock, ArrowRight, Users } from 'lucide-react'
import { BLOG_POSTS, BlogPost } from '@/data/blogData'
import { cn } from '@/lib/utils'

type BlogDetailModalProps = {
  open: boolean
  selectedSlug: string | null
  onClose: () => void
  onNext: () => void
}

export default function BlogDetailModal({
  open,
  selectedSlug,
  onClose,
  onNext,
}: BlogDetailModalProps) {
  const post: BlogPost | undefined =
    selectedSlug ? BLOG_POSTS.find((p) => p.slug === selectedSlug) : undefined
  const currentIndex = post ? BLOG_POSTS.findIndex((p) => p.slug === post.slug) : -1
  const isLast = currentIndex === BLOG_POSTS.length - 1 && BLOG_POSTS.length > 0

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, onNext])

  if (!open || !post) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-detail-title"
    >
      <div
        className="absolute inset-0 bg-brand-900/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative z-10 w-full md:max-w-3xl lg:max-w-4xl max-h-[88vh] md:max-h-[85vh]',
          'md:rounded-3xl rounded-t-3xl bg-cream-50 border md:border border-slate-200/70',
          'shadow-[0_30px_90px_-20px_rgba(15,81,50,0.45)]',
          'flex flex-col overflow-hidden',
          'animate-in md:animate-[fadeIn_.25s_ease,zoomIn_.25s_ease]',
        )}
      >
        <div className="relative shrink-0 px-5 md:px-8 pt-5 md:pt-6 pb-3 md:pb-4 flex items-start justify-between gap-4 border-b border-slate-200/60 bg-gradient-to-br from-white to-cream-50">
          <div className="min-w-0 flex flex-col gap-2">
            <span
              className="inline-flex items-center self-start rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ color: '#0F5132' }}
            >
              {post.category}
            </span>
            <h2
              id="blog-detail-title"
              className="text-xl md:text-2xl font-extrabold tracking-tight min-w-0 break-words"
              style={{ color: '#2c3135' }}
            >
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs md:text-[13px]" style={{ color: '#2c3135', opacity: 0.7 }}>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{post.targetAudience}</span>
              </span>
            </div>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-slate-200/70 bg-white px-2.5 py-1 text-[10.5px] font-semibold"
                    style={{ color: '#0F5132' }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border border-slate-200/70 bg-white hover:bg-brand-50 hover:border-brand-200 transition-all duration-200 hover:-translate-y-0.5"
          >
            <X className="w-4.5 h-4.5" style={{ color: '#2c3135', opacity: 0.8 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6 space-y-4 md:space-y-5">
          <p className="text-base md:text-lg font-semibold leading-relaxed" style={{ color: '#2c3135' }}>
            {post.subtitle}
          </p>
          <div className="w-full h-px bg-slate-200/60" />

          <p className="leading-[1.85] md:text-[15px]" style={{ color: '#2c3135', opacity: 0.9 }}>
            {post.excerpt}
          </p>

          <div
            className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 px-4 md:px-5 py-3.5 text-sm md:text-[14px] font-medium italic"
            style={{ color: '#0F5132' }}
          >
            🚧 Bu blog yazısının detay içeriği şu anda hazırlanmaktadır. Tam metin, görseller ve ek kaynaklar
            en kısa sürede yayınlanacaktır.
          </div>

          <div className="space-y-4 pt-1">
            <h3 className="text-lg md:text-xl font-extrabold tracking-tight" style={{ color: '#2c3135' }}>
              İçerik Özeti (Yakında)
            </h3>
            <p className="leading-[1.85] md:text-[15px]" style={{ color: '#2c3135', opacity: 0.88 }}>
              Bu bölümde, konuya ilişkin temel kavramlar, sektör genelinde güncel mevzuat gelişmeleri,
              pratik uygulama örnekleri ve işletmeniz için atabileceğiniz adım adım aksiyon planları
              yer alacaktır.
            </p>
            <p className="leading-[1.85] md:text-[15px]" style={{ color: '#2c3135', opacity: 0.88 }}>
              CBAM metrikleri, AB gümrük uygulamaları, tedarik zinciri şeffaflığı, ISO standartları ile uyum
              ve Yeşil Yaprak Rozeti başvuru kriterleri gibi konular uzman ekibimiz tarafından titizlikle
              hazırlanmaktadır.
            </p>
            <p className="leading-[1.85] md:text-[15px]" style={{ color: '#2c3135', opacity: 0.88 }}>
              İçeriğin yayınlanmasını takip etmek için <strong>Yeşil Yaprak Haber Bülteni</strong>ne abone olabilir,
              ya da <strong style={{ color: '#0F5132' }}>#calculator</strong> bölümünden ücretsiz CBAM risk
              değerlendirmenizi hemen başlatabilirsiniz.
            </p>
          </div>
        </div>

        <div className="shrink-0 px-5 md:px-8 py-4 md:py-5 border-t border-slate-200/60 bg-white/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="text-xs md:text-sm" style={{ color: '#2c3135', opacity: 0.7 }}>
            {BLOG_POSTS.length > 0 ? (
              <>
                Yazı <strong style={{ color: '#0F5132' }}>{currentIndex + 1}</strong> / {BLOG_POSTS.length}
                {isLast && <span className="ml-2">· Listenin sonundasınız</span>}
              </>
            ) : null}
          </div>

          <div className="flex items-stretch md:items-center gap-2 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-sm font-bold hover:bg-cream-50 transition-all duration-200"
              style={{ color: '#2c3135' }}
            >
              Kapat
            </button>
            <button
              onClick={onNext}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white bg-cta-gradient hover:scale-[1.02] transition-all duration-200 shadow-emerald-glow"
            >
              {isLast ? 'İlk Yazıya Dön' : 'Sonraki Yazı'}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
