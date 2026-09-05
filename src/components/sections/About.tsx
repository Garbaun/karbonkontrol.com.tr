import { useMemo, useState, useEffect } from 'react'
import {
  Clock, Users, CalendarDays, ArrowRight, Search, X, Mail, CheckCircle2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { BLOG_POSTS } from '@/data/blogData'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'
import { IMAGES } from '@/assets/images'

const clampLine = (lines: number): React.CSSProperties => ({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  lineClamp: lines.toString(),
})

export type AboutProps = { onOpenBlog?: (slug: string) => void }

const PAGE_SIZE = 4

export function About({ onOpenBlog }: AboutProps = {}) {
  const { scope } = useScrollReveal()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [email, setEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success'>('idle')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setNewsletterState('success')
    setEmail('')
    setTimeout(() => setNewsletterState('idle'), 3500)
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 180)
    return () => clearTimeout(t)
  }, [searchQuery])

  const filteredPosts = useMemo(() => {
    const q = debouncedQuery.toLocaleLowerCase('tr-TR')
    if (!q) return BLOG_POSTS
    return BLOG_POSTS.filter((p) => {
      const haystack = [
        p.title, p.subtitle, p.excerpt, p.category,
        p.targetAudience, p.date, ...(p.tags || []),
      ].join(' ').toLocaleLowerCase('tr-TR')
      return haystack.includes(q)
    })
  }, [debouncedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE
  const pageEnd = pageStart + PAGE_SIZE
  const pagePosts = filteredPosts.slice(pageStart, pageEnd)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery])

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const N = totalPages
    const cur = safeCurrentPage
    if (N <= 7) {
      for (let i = 1; i <= N; i++) pages.push(i)
    } else {
      pages.push(1)
      if (cur > 4) pages.push('ellipsis')
      const start = Math.max(2, cur - 2)
      const end = Math.min(N - 1, cur + 2)
      for (let i = start; i <= end; i++) pages.push(i)
      if (cur < N - 3) pages.push('ellipsis')
      pages.push(N)
    }
    return pages
  }, [totalPages, safeCurrentPage])

  return (
    <section
      id="blog"
      className={cn(
        'section-padding relative overflow-hidden scroll-mt-[80px]',
        '!pt-0 sm:!pt-0 md:!pt-0 lg:!pt-0 xl:!pt-0 2xl:!pt-0',
        '!mt-0',
      )}
      style={{
        backgroundImage: `url(${IMAGES.blogBg})`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
      ref={scope}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/45 to-white/80 pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-transparent to-transparent pointer-events-none"
        style={{ display: 'none' }}
      />

      {/* Newsletter Bülteni (Blog Üst) */}
      <div
        className="relative overflow-hidden"
        data-reveal
        data-delay="0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F5132]/72 via-[#0F5132]/55 to-[#0F5132]/45 pointer-events-none" />
        <div className="relative z-10 px-6 md:px-12 lg:px-20 xl:px-28 py-10 md:py-14 xl:py-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 max-w-[1600px] mx-auto">
          <div className="max-w-2xl shrink-0">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Yeşil Yaprak Blog Haber Bülteni
            </h3>
          </div>
          <div className="w-full md:w-auto md:min-w-[440px] shrink-0">
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <div className={cn(
                'flex items-center rounded-2xl bg-white p-1.5 pr-2 shadow-xl shadow-black/10 border border-white/30 transition-all duration-300',
                newsletterState === 'success' && 'ring-2 ring-white/60'
              )}>
                <div className="flex items-center flex-1 min-w-0 gap-3 px-3.5 py-1.5">
                  <Mail className={cn(
                    'shrink-0 transition-colors duration-300',
                    newsletterState === 'success' ? 'text-emerald-600' : 'text-slate-400'
                  )} style={{ width: '18px', height: '18px' }} />
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresinizi yazın..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={newsletterState === 'success'}
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 text-slate-800 disabled:opacity-70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterState === 'success'}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300',
                    newsletterState === 'success'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cta-gradient text-white hover:brightness-110 active:scale-[0.98]',
                  )}
                >
                  {newsletterState === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Abone Olundu</span>
                    </>
                  ) : (
                    <>
                      <span>Abone Ol</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-x relative z-10 pt-4 md:pt-7 lg:pt-8 xl:pt-10 2xl:pt-12">
        <div
          className="mb-6 md:mb-8 flex items-center gap-3 rounded-2xl bg-white border border-slate-200/60 px-4 py-2.5 shadow-soft focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-brand-500/30 transition-all duration-300"
          data-reveal
          data-delay="0.1"
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: '#2c3135', opacity: 0.55 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Blog başlığı, etiket veya konu ara... (örn: CBAM, EcoVadis, Yeşil Finans)"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm md:text-base font-medium placeholder:text-slate-400"
            style={{ color: '#2c3135' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              aria-label="Aramayı temizle"
            >
              <X className="w-4 h-4" style={{ color: '#2c3135', opacity: 0.7 }} />
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className="text-xs md:text-sm"
            style={{ color: '#2c3135', opacity: 0.75 }}
            data-reveal
            data-delay="0.18"
          >
            <span className="font-bold" style={{ color: '#0F5132' }}>{filteredPosts.length}</span> blog içeriği bulundu ·
            {' '}Sayfa <span className="font-bold" style={{ color: '#0F5132' }}>{safeCurrentPage}</span> / {totalPages}
          </div>
        </div>

        {pagePosts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-dashed border-slate-300/80 p-10 md:p-14 text-center">
            <p className="text-base md:text-lg font-semibold" style={{ color: '#2c3135' }}>
              Aramanızla eşleşen bir blog içeriği bulunamadı.
            </p>
            <p
              className="text-sm md:text-base mt-2"
              style={{ color: '#2c3135', opacity: 0.75 }}
            >
              Farklı bir kelime veya etiket denemek ister misiniz?
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-5 py-3 text-sm font-bold text-brand-700 hover:bg-brand-100 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Aramayı Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {pagePosts.map((post, idx) => (
              <article
                key={post.slug}
                className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/60 p-5 lg:p-6 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                data-reveal
                data-stagger="false"
                data-delay={String(0.02 * idx)}
              >
                <span
                  className="inline-flex items-center self-start rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide shrink-0 mb-3"
                  style={{ color: '#0F5132' }}
                >
                  {post.category}
                </span>

                <h3
                  className="text-base md:text-[17px] font-bold leading-snug w-full min-w-0"
                  style={{ color: '#2c3135', ...clampLine(2) }}
                >
                  {post.title}
                </h3>

                <p
                  className="text-sm mt-2 w-full min-w-0"
                  style={{ color: '#2c3135', opacity: 0.78, ...clampLine(2) }}
                >
                  {post.subtitle}
                </p>

                <p
                  className="text-sm mt-3 leading-relaxed w-full min-w-0 flex-1"
                  style={{ color: '#2c3135', opacity: 0.86, ...clampLine(3) }}
                >
                  {post.excerpt}
                </p>

                {post.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 w-full min-w-0">
                    {post.tags.slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(tag)}
                        className="cursor-pointer inline-flex items-center rounded-full border border-slate-200/70 bg-cream-50 px-2.5 py-1 text-[10.5px] font-semibold transition-all duration-200 hover:bg-brand-50 hover:border-brand-200 hover:scale-[1.03]"
                        style={{ color: '#0F5132' }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-200/60 flex flex-col gap-2.5 w-full min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium w-full min-w-0" style={{ color: '#2c3135', opacity: 0.65 }}>
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                    <span className="shrink-0 font-semibold">Tarih:</span>
                    <span className="truncate min-w-0">{post.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium w-full min-w-0" style={{ color: '#2c3135', opacity: 0.65 }}>
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="shrink-0 font-semibold">Süre:</span>
                    <span className="truncate min-w-0">{post.readTime}</span>
                  </div>

                  <div className="flex items-center gap-1.5 w-full min-w-0">
                    <Users className="w-3.5 h-3.5 shrink-0" style={{ color: '#2c3135', opacity: 0.6 }} />
                    <span
                      className="text-[11.5px] leading-snug w-full min-w-0"
                      style={{ color: '#2c3135', opacity: 0.7, ...clampLine(2) }}
                    >
                      {post.targetAudience}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenBlog?.(post.slug)}
                    aria-label="Devamını oku"
                    className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold transition-all duration-300 group/link text-brand-700 hover:text-brand-800 self-start"
                  >
                    Devamını Oku
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-2"
            data-reveal
            data-delay="0.25"
            aria-label="Blog sayfalandırma"
          >
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              className={cn(
                'shrink-0 inline-flex items-center justify-center gap-1 w-10 h-10 md:w-11 md:h-11 rounded-xl border font-bold transition-all duration-200',
                safeCurrentPage === 1
                  ? 'border-slate-200/60 bg-white/50 cursor-not-allowed opacity-40'
                  : 'border-slate-200/80 bg-white hover:bg-brand-50 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-soft'
              )}
              style={{ color: '#2c3135' }}
              aria-label="İlk sayfaya git"
            >
              <ChevronsLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className={cn(
                'shrink-0 inline-flex items-center justify-center gap-1 w-10 h-10 md:w-11 md:h-11 rounded-xl border font-bold transition-all duration-200',
                safeCurrentPage === 1
                  ? 'border-slate-200/60 bg-white/50 cursor-not-allowed opacity-40'
                  : 'border-slate-200/80 bg-white hover:bg-brand-50 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-soft'
              )}
              style={{ color: '#2c3135' }}
              aria-label="Önceki sayfa"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex items-center gap-1.5 md:gap-2">
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span
                    key={`e-${i}`}
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 font-bold text-base md:text-lg"
                    style={{ color: '#2c3135', opacity: 0.5 }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    aria-current={p === safeCurrentPage ? 'page' : undefined}
                    className={cn(
                      'shrink-0 inline-flex items-center justify-center min-w-[40px] md:min-w-[44px] h-10 md:h-11 px-3 rounded-xl border text-sm md:text-base font-bold transition-all duration-200',
                      p === safeCurrentPage
                        ? 'bg-cta-gradient border-transparent text-white shadow-emerald-glow -translate-y-0.5'
                        : 'border-slate-200/80 bg-white hover:bg-brand-50 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-soft'
                    )}
                    style={p === safeCurrentPage ? {} : { color: '#2c3135' }}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className={cn(
                'shrink-0 inline-flex items-center justify-center gap-1 w-10 h-10 md:w-11 md:h-11 rounded-xl border font-bold transition-all duration-200',
                safeCurrentPage === totalPages
                  ? 'border-slate-200/60 bg-white/50 cursor-not-allowed opacity-40'
                  : 'border-slate-200/80 bg-white hover:bg-brand-50 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-soft'
              )}
              style={{ color: '#2c3135' }}
              aria-label="Sonraki sayfa"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className={cn(
                'shrink-0 inline-flex items-center justify-center gap-1 w-10 h-10 md:w-11 md:h-11 rounded-xl border font-bold transition-all duration-200',
                safeCurrentPage === totalPages
                  ? 'border-slate-200/60 bg-white/50 cursor-not-allowed opacity-40'
                  : 'border-slate-200/80 bg-white hover:bg-brand-50 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-soft'
              )}
              style={{ color: '#2c3135' }}
              aria-label="Son sayfaya git"
            >
              <ChevronsRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}
