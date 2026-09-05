import { useEffect, useRef } from 'react'
import { Search, BarChart3, Target, BadgeCheck } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IMAGES } from '@/assets/images'

gsap.registerPlugin(ScrollTrigger)

interface StepData {
  number: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  delay: string
}

const steps: StepData[] = [
  {
    number: '1',
    icon: Search,
    title: 'Ücretsiz Analiz',
    description: 'Firma bilgilerinizle hızlı analiz',
    delay: '0',
  },
  {
    number: '2',
    icon: BarChart3,
    title: 'Risk Değerlendirme',
    description: 'CBAM risk skorunuz ve ihracat etkisi',
    delay: '0.1',
  },
  {
    number: '3',
    icon: Target,
    title: 'Strateji Geliştirme',
    description: 'Özel aksiyon planı ve azaltma yolları',
    delay: '0.2',
  },
  {
    number: '4',
    icon: BadgeCheck,
    title: 'Sertifikasyon & Raporlama',
    description: 'ISO/CBAM raporlarınızın teslim edilmesi',
    delay: '0.3',
  },
]

export default function Process() {
  const connectorRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (connectorRef.current) {
        gsap.fromTo(
          connectorRef.current,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: true,
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGES.howItWorksBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container-x relative z-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="eyebrow mb-4">Süreç</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
          Nasıl Çalışıyoruz?
        </h2>
        <p className="md:text-lg">
          4 basit adımda CBAM riskinizi minimize ediyor, sertifikasyon sürecinizi yönetiyoruz.
        </p>
      </div>

      <div className="mt-20 relative flex flex-col md:flex-row gap-12 md:grid md:grid-cols-4 md:gap-2 items-start">
        <div className="hidden md:block absolute top-18 inset-x-0 h-1 bg-slate-100 rounded-full" />
        <div
          ref={connectorRef}
          className="hidden md:block absolute top-18 left-0 h-1 bg-cta-gradient rounded-full"
          style={{ width: '0%' }}
        />

        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              data-reveal
              data-delay={step.delay}
              className="relative w-full text-center"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-cta-gradient text-white font-bold flex items-center justify-center mx-auto mb-5">
                  {step.number}
                </div>
                <div className="inline-flex bg-brand-50 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold my-3">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </section>
  )
}
