import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Users } from 'lucide-react'
import { IMAGES } from '@/assets/images'
import { cn } from '@/lib/utils'

type Slide = {
  title: string
  subtitle: string
}

const SLIDES: Slide[] = [
  {
    title:
      'Avrupa İhracatında Sınırda Karbon Dönemi Başladı. Şirketiniz Hazır mı?',
    subtitle:
      'Sadece ürün kalitesi değil, üretimdeki emisyon ayak iziniz de artık rekabet gücünüzü belirliyor. CBAM düzenlemelerine erken uyum sağlayarak AB pazarındaki yerinizi ve pazar payınızı güvence altına alın.',
  },
  {
    title: 'Aylar Süren İklim Danışmanlığını Saniyelere İndiren Teknoloji.',
    subtitle:
      'Geleneksel, hantal ve karmaşık hesaplama süreçlerini unutun. Uluslararası emisyon algoritmalarını entegre eden yapay zeka altyapımızla, verilerinizi anında denetçilere hazır stratejik verilere dönüştürün.',
  },
  {
    title:
      'Sadece Karbon Ayak İzinizi Ölçmeyin; Dünyaya Olan Sorumluluğunuzu Belgeleyin.',
    subtitle:
      'Şeffaflık, doğruluk ve bilimsel metodoloji... Sektör referans değerlerinin altına inen ve karbon emisyonunu yöneten markanızı Yeşil Yaprak Rozeti ile küresel pazarda taçlandırın.',
  },
]

const SLIDE_MS = 7000
const BAR_FILL_CLASS =
  'absolute inset-y-0 left-0 bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400 rounded-full'
const BAR_IDLE_CLASS = 'bg-slate-200/70 hover:bg-slate-300/80'
const BAR_ACTIVE_TRACK_CLASS = 'bg-slate-200'

export function Hero() {
  const [active, setActive] = useState(0)
  const [activeBarProgress, setActiveBarProgress] = useState<number>(0)

  const scope = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const slideStartTs = useRef<number>(performance.now())
  const pausedUntil = useRef<number>(0)

  const goTo = useCallback((index: number) => {
    const next = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length
    setActive(next)
    setActiveBarProgress(0)
    slideStartTs.current = performance.now()
    pausedUntil.current = 0
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        xPercent: -next * 100,
        duration: 0.9,
        ease: 'power3.inOut',
      })
    }
  }, [])

  // RAF döngüsü: aktif slayt çubuğunu %0-100 doldurur, dolunca sonraki slayta
  useEffect(() => {
    const tick = (ts: number) => {
      if (ts < pausedUntil.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = ts - slideStartTs.current
      const ratio = Math.min(1, Math.max(0, elapsed / SLIDE_MS))
      setActiveBarProgress(ratio)
      if (ratio >= 1) {
        goTo(active + 1)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [active, goTo])

  // Bar'a tık: 1. bar → slide 0, 2. bar → slide 1, 3. bar → slide 2
  const handleBarClick = (barIndex: number) => {
    if (barIndex === active) return
    goTo(barIndex)
  }

  // GSAP mount entry (scope: tüm gsap çağrıları scope altında toplanır, unmount'da ctx.revert() cleanup
  useEffect(() => {
    const el = scope.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-carousel', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        delay: 0.15,
        ease: 'power2.out',
      })
      gsap.from('.hero-progress', {
        y: 14,
        opacity: 0,
        duration: 0.7,
        delay: 0.35,
        ease: 'power2.out',
      })
      gsap.from('.hero-buttons', {
        y: 16,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
        ease: 'power2.out',
      })
      if (trackRef.current) {
        gsap.set(trackRef.current, { xPercent: 0 })
      }
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={scope}
      className={cn(
        'relative section-padding pt-28 md:pt-32 overflow-hidden'
      )}
      style={{
        backgroundImage: `url(${IMAGES.heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Kontrast overlay (arkaplanda okunabilirliği için) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(248,250,249,0.42) 0%, rgba(248,250,249,0.28) 40%, rgba(248,250,249,0.16) 100%)',
        }}
      />
      <div className="container-x relative z-10">
        <div className="hero-left mx-auto max-w-4xl text-center">
          {/* Carousel */}
          <div className="hero-carousel relative">
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex w-full"
              >
                {SLIDES.map((s, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-full px-1"
                  >
                    <h1
                      className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]"
                      style={{ color: '#2c3135' }}
                    >
                      {s.title}
                    </h1>
                    <p
                      className="mt-5 md:mt-6 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
                      style={{ color: '#2c3135', opacity: 0.88 }}
                    >
                      {s.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar (3 yatay çubuk) */}
          <div className="hero-progress mt-8 md:mt-10 mx-auto max-w-md">
            <div
              className="flex items-center gap-4 justify-center"
              role="tablist"
              aria-label="Hero slaytları"
            >
              {SLIDES.map((_, i) => {
                let fillRatio = 0
                if (i === active) {
                  fillRatio = activeBarProgress
                } else if (i < active) {
                  fillRatio = 1
                }
                return (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={active === i}
                    aria-label={`Slayt ${i + 1}`}
                    onClick={() => handleBarClick(i)}
                    className={cn(
                      'group relative overflow-hidden h-[3px] rounded-full flex-1 max-w-[110px] cursor-pointer transition-colors duration-300',
                      i <= active ? BAR_ACTIVE_TRACK_CLASS : BAR_IDLE_CLASS
                    )}
                  >
                    <span
                      className={BAR_FILL_CLASS}
                      style={{
                        width: `${fillRatio * 100}%`,
                        transition: 'none',
                      }}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="hero-buttons mt-9 md:mt-12 flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cta-gradient px-8 py-4 text-base md:text-lg font-bold text-white shadow-emerald-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-600/30 active:scale-[0.98]"
            >
              <Users className="w-5 h-5" />
              Ekibimizle görüşün
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <div
              className="text-xs md:text-sm font-medium flex items-center justify-center gap-2"
              style={{ color: '#2c3135', opacity: 0.82 }}
            >
              <span className="inline-flex w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
              Uzman danışmanlardan ücretsiz geri dönüş
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
