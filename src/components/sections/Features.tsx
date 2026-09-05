import { ShieldCheck, Award, Leaf, FileBarChart } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { IMAGES } from '@/assets/images'

const features = [
  {
    icon: ShieldCheck,
    title: 'CBAM Danışmanlığı',
    description: 'AB Sınır Karbon Vergisi risk analiz ve raporlama hizmetleri ile ceza riskinizi sıfırlıyoruz.',
    delay: 0,
  },
  {
    icon: Award,
    title: 'ISO 14001/27001 Sertifikasyonu',
    description: 'Tam kapsamlı denetim, belgelendirme ve kurumsal sürdürülebilirlik altyapısı kurulumu.',
    delay: 0.1,
  },
  {
    icon: Leaf,
    title: 'Karbon Ayak İzi Ölçümü',
    description: 'Kurumsal ve ürün bazlı GHG hesaplama, emisyon envanteri ve azaltım stratejileri.',
    delay: 0.2,
  },
  {
    icon: FileBarChart,
    title: 'Sürdürülebilirlik Raporlama',
    description: 'ESG, BIST Sürdürülebilirlik ve uluslararası standartlara uygun raporlama danışmanlığı.',
    delay: 0.3,
  },
]

export function Features() {
  const { scope } = useScrollReveal()

  return (
    <section id="features" className="section-padding relative" ref={scope}>
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance"
              data-reveal
              data-delay="0"
              style={{ color: '#2c3135' }}
            >
              Geleceği Şekillendiren İhracatçılara Küresel Güven Sembolü: Yeşil Yaprak Rozeti
            </h2>
            <p
              className="md:text-lg leading-relaxed"
              data-reveal
              data-delay="0.08"
              style={{ color: '#2c3135', opacity: 0.88 }}
            >
              Sürdürülebilir bir gelecek, yalnızca üretim yapmakla değil; üretimin çevresel etkilerini sorumlulukla yönetmekle mümkündür. Yeşil Yaprak Rozet Sistemi, Avrupa Birliği Sınırda Karbon Düzenleme Mekanizması (CBAM) metriklerine ve uluslararası emisyon standartlarına tam uyum sağlayan öncü firmaları tescilleyen prestijli bir doğrulama mekanizmasıdır. Karbon ayak izini referans değerlerin altına çeken ve şeffaf raporlama ilkesini benimseyen ihracatçılarımız, bu özel rozet ile AB pazarında üst düzey bir ticari güvenlik ve prestij katmanı kazanır. Yeşil Yaprak, firmanızın sadece küresel regülasyonlara hazır olduğunu göstermekle kalmaz; dünyamızı iyileştiren, yeşil finansmana erişimi kolaylaştıran ve tedarik zincirlerinde tercih edilen lider bir marka olduğunuzu kanıtlar.
            </p>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <img
              src={IMAGES.yesilYaprak3}
              alt="Yeşil Yaprak Rozeti"
              className="w-[60%] h-auto object-contain drop-shadow-xl"
              data-reveal
              data-delay="0.12"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="card-base p-7"
                data-reveal
                data-delay={String(feature.delay)}
              >
                <div className="bg-brand-50 text-brand-700 rounded-xl p-3 w-14 h-14 mb-5 inline-flex items-center justify-center">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#2c3135' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#2c3135', opacity: 0.88 }}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
