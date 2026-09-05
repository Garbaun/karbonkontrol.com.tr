import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Testimonial = {
  id: number
  name: string
  position: string
  company: string
  sector: string
  rating: number
  quote: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mehmet Yılmaz',
    position: 'Operasyon Direktörü',
    company: 'Çeliker Metal A.Ş.',
    sector: 'Demir-Çelik',
    rating: 5,
    quote:
      'CBAM riskimizi 2 dakikada hesapladık, uzman ekibimiz 24 saat içinde özel raporumuzu hazırladı. Kötü sürprizlerle karşılaşmadan ihracat takvimimizi koruduk. Kalibre ekibine teşekkürler.',
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    position: 'CFO',
    company: 'Seramik Dünya',
    sector: 'Seramik',
    rating: 5,
    quote:
      'Karbon ayak izi ölçümü yapmadan ihracat yapmaya devam edemeyeceğimizi çok geç öğrenmiştik. SAIT motoru ile geçmiş dönem verilerimizi tek tıkla analiz ettik, ceza riskini %78 azalttık.',
  },
  {
    id: 3,
    name: 'Can Kaya',
    position: 'İhracat Müdürü',
    company: 'Yeşil Gübre Sanayi',
    sector: 'Gübre',
    rating: 5,
    quote:
      'Köklü bir kuruluşuz, sürdürülebilirlik bürokrasisi bizi çok yavaşlatıyordu. Yeşil Yaprak Rozeti ile müşterilerimiz artık emisyon değerlerimizi belge olarak görüyor, güven tazelendi. Siparişlerimiz %22 arttı.',
  },
  {
    id: 4,
    name: 'Zeynep Şahin',
    position: 'Genel Müdür',
    company: 'Çimento Medya',
    sector: 'Çimento',
    rating: 5,
    quote:
      'AB Komisyonu güncellemeleri ve dinamik katsayılar her gün değişiyor. KarbonKontrol SAIT motoru katsayıları anlık takip ederek her zaman güncel rapor üretiyor. Kendi ekibimizden daha hızlı.',
  },
  {
    id: 5,
    name: 'Hakan Öztürk',
    position: 'Sürdürülebilirlik Sorumlusu',
    company: 'Alüminyum Profil',
    sector: 'Alüminyum',
    rating: 5,
    quote:
      'Geri dönüştürülmüş alüminyum kullanım oranlarımızı rapora dahil edince CBAM vergi matrahımızı %91 düşürdük. Uzman ekip her adımda yanımızda oldu, şimdi Yeşil Yaprak Rozeti ile rahatlıkla övünüyoruz.',
  },
  {
    id: 6,
    name: 'Deniz Çelik',
    position: 'Satış Direktörü',
    company: 'Cam Sanayi',
    sector: 'Cam',
    rating: 5,
    quote:
      '10 yıllık ISO 14001 sertifikamız vardı ama CBAM için yeterli olmadığını öğrenince panikledik. KarbonKontrol ile 1 ay içinde sertifikasyon ve CBAM uyumunu tamamladık, müşterimiz ile sözleşme kaybı yaşamadık.',
  },
  {
    id: 7,
    name: 'Buse Arslan',
    position: 'Üretim Direktörü',
    company: 'Hidrojen Teknoloji',
    sector: 'Hidrojen',
    rating: 5,
    quote:
      'Yeşil hidrojen yatırımı yaparken karbon katsayılarının hangi oranda indirgenmesini hesaplamak imkansızdı. SAIT ile hangi yatırımın ne kadar vergi indireceğini gördük, bütçemizi doğru yönetiyoruz.',
  },
  {
    id: 8,
    name: 'Ali Murat',
    position: 'Kurucu Ortak',
    company: 'Amonyak Kimya',
    sector: 'Amonyak',
    rating: 5,
    quote:
      'Kurumsal müşterilerimiz artık sözleşmelere karbon emisyon hedefi maddesi ekliyor. KarbonKontrol + Yeşil Yaprak Rozeti ile onların taleplerine 1 gün içinde cevap verebiliyoruz. İş akışımız çok hızlandı.',
  },
  {
    id: 9,
    name: 'Elif Aydın',
    position: 'Lojistik Müdürü',
    company: 'Euro Tekstil',
    sector: 'Tekstil',
    rating: 5,
    quote:
      'Geniş müşteri portföyümüz ile karbon ayak izi her ürünü tek tek hesaplamak için yazılım almamız gerekirdi. KarbonKontrol bize tüm ürün gamımız için tek panelden görünürlük sağladı, maliyetimizi 1/10 düşürdü.',
  },
  {
    id: 10,
    name: 'Murat Yıldırım',
    position: 'Finans Direktörü',
    company: 'Euro Ambalaj',
    sector: 'Plastik - Ambalaj',
    rating: 5,
    quote:
      'AB PPWR ambalaj yönetmeliği ile CBAM birleşince şirketimizde konu çok karmaşık hale gelmişti. 1 saatlik toplantı ile tüm riskleri haritalandırdık, 3 aylık aksiyon planı ile ceza riskimiz SIFIRLANDI.',
  },
  {
    id: 11,
    name: 'Selin Toprak',
    position: 'CEO',
    company: 'Gıda Lojistik',
    sector: 'Gıda',
    rating: 5,
    quote:
      'Soğuk zincir lojistik alanında Scope 3 emisyonları hesaplamak en zor işimizdi. KarbonKontrol SAIT algoritması ile tüm tedarikçilerimizin verisini tek noktada topladık, yönetim kurulu raporu 1 saatte hazır. Eskiden 2 hafta sürerdi.',
  },
  {
    id: 12,
    name: 'Burak Erdoğan',
    position: 'Satış Müdürü',
    company: 'Sermaye Makina',
    sector: 'Sermaye Malları',
    rating: 5,
    quote:
      'Alman makine müşterilerimiz artık Yeşil Yaprak Rozeti olmayan teklifleri dikkate almıyor. Rozeti 1 ay sonra almamızla birlikte ihracat gelirimiz %38 arttı. Kesinlikle yapmaya değer bir yatırım.',
  },
]

const PAGE_SIZE = 3 // 3lü görünüm
const PAGES_COUNT = Math.ceil(TESTIMONIALS.length / PAGE_SIZE) // 12 / 3 = 4 (4 sayfa / 4 çizgi)

export default function Testimonials() {
  const [page, setPage] = useState<number>(0)
  const timerRef = useRef<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const paged = useMemo<Testimonial[][]>(() => {
    const result: Testimonial[][] = []
    for (let i = 0; i < PAGES_COUNT; i++) {
      result.push(TESTIMONIALS.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE))
    }
    return result
  }, [])

  const setPageSafe = (next: number) => {
    const safe = ((next % PAGES_COUNT) + PAGES_COUNT) % PAGES_COUNT
    setPage(safe)
  }

  const goNext = () => setPageSafe(page + 1)
  const goPrev = () => setPageSafe(page - 1)

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(goNext, 9000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [page])

  const trackPercent = -(100 * page)

  return (
    <section id="testimonials" className="relative section-padding">
      <div className="container-x">
        {/* Header */}
        <div
          className="mx-auto max-w-3xl text-center mb-10 md:mb-14"
          data-reveal
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Müşteri Deneyimleri
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2c3135] mb-5">
            50+ Kurumun Güvendiği{' '}
            <span className="text-emerald-700">Çözüm Ortağımız</span>
          </h2>
          <p className="text-base md:text-lg text-[#2c3135] opacity-85 leading-relaxed font-medium max-w-2xl mx-auto">
            İhracatta ceza riskini ortadan kaldıran, Yeşil Yaprak Rozeti ile marka değerini yükselten müşterilerimizin gerçek hikayelerini inceleyin.
          </p>
        </div>

        {/* Slider */}
        <div className="relative" data-reveal data-delay="0.05">
          {/* Sol/Sağ butonlar (Sadece md+) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Önceki yorumlar"
            className="hidden md:inline-flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-6 z-20 items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Sonraki yorumlar"
            className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-6 z-20 items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden rounded-3xl px-2 md:px-6">
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-out will-change-transform"
              style={{ transform: `translateX(${trackPercent}%)` }}
            >
              {paged.map((group, pageIdx) => (
                <div
                  key={`page-${pageIdx}`}
                  className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
                >
                  {group.map((t) => (
                    <article
                      key={t.id}
                      className="group relative flex flex-col h-full rounded-3xl bg-white border border-slate-200/60 p-5 md:p-6 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      {/* Alıntı ikonu (arka plan) */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute top-5 right-5 text-emerald-200/60 transition-all duration-300 group-hover:text-emerald-300 group-hover:scale-110"
                      >
                        <Quote className="w-10 h-10" />
                      </div>

                      {/* Puan */}
                      <div className="flex items-center gap-1 mb-4 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={cn(
                              'w-[19px] h-[19px] transition-colors shrink-0',
                              i < t.rating ? 'text-amber-400' : 'text-slate-200',
                            )}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>

                      {/* Metin (Kartı doldursun -> flex-1) */}
                      <p
                        className="text-sm md:text-[15px] leading-relaxed font-medium flex-1 w-full min-w-0 mb-4"
                        style={{ color: '#2c3135' }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      {/* Kişi + Firma (BLOG KART stili → mt-auto, border-t, padding, EN ALT ORTALANDI) */}
                      <div className="mt-auto pt-4 border-t border-slate-200/60 w-full min-w-0 flex flex-col gap-2 items-stretch">
                        {/* İsim + Pozisyon → Kullanıcı bilgileri KUTUNUN ALTINDA (sola hizalı Blog kart meta gibi) */}
                        <div className="flex flex-col w-full min-w-0 text-left">
                          <p
                            className="text-[15px] font-extrabold truncate w-full min-w-0"
                            style={{ color: '#2c3135' }}
                          >
                            {t.name}
                          </p>
                          <p
                            className="text-xs font-semibold truncate w-full min-w-0 mt-0.5"
                            style={{ color: '#475569' }}
                          >
                            {t.position}
                          </p>
                        </div>

                        {/* Firma · Sektör → EN ALTTA ORTALANDI, TAŞMA YOK */}
                        <p className="mt-1 w-full min-w-0 text-center">
                          <span className="inline-flex items-center gap-1.5 max-w-full text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 border border-emerald-200/40 rounded-full px-2.5 py-1 break-words hyphens-auto">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate min-w-0 max-w-[calc(100%-1.2rem)]">
                              {t.company} · {t.sector}
                            </span>
                          </span>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobil ok butonlar */}
          <div className="md:hidden flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Önceki yorumlar"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki yorumlar"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Alt 4 çizgi (sayfa gösterge progress - 4 tane çizgi) */}
          <div
            role="tablist"
            aria-label="Yorum sayfaları"
            className="mt-8 flex items-center justify-center gap-2.5"
          >
            {Array.from({ length: PAGES_COUNT }).map((_, idx) => {
              const active = idx === page
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Yorumlar ${idx + 1}. sayfa`}
                  onClick={() => setPageSafe(idx)}
                  className={cn(
                    'group relative h-1.5 rounded-full transition-all duration-500 ease-out overflow-hidden',
                    active ? 'w-14 bg-emerald-500 shadow-md shadow-emerald-500/40' : 'w-8 bg-slate-200 hover:bg-slate-300',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left animate-[grow_9s_linear_infinite] bg-white/40"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
