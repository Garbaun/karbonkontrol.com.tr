import type { FC } from 'react'
import { CheckCircle2, Sparkles, Leaf, Factory, Building2, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PricingTierKey = 'starter' | 'standard' | 'professional'

export type PricingPackage = {
  key: PricingTierKey
  eyebrowIcon: FC<{ className?: string }>
  eyebrow: string
  title: string
  headline: string
  audience: string
  description: string
  cta: string
  ctaVariant: 'solid' | 'outlined'
  featured?: boolean
  badge?: string
  features: string[]
}

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    key: 'starter',
    eyebrowIcon: Leaf,
    eyebrow: 'Başlangıç Paketi',
    title: 'Karbon Ayak İzi Başlangıç',
    headline: 'Sürdürülebilirlik Yolculuğunuza Sağlam Bir Adım Atın',
    audience: 'İlk kez emisyon envanteri oluşturan işletmeler',
    description:
      'İşletmenizin temel emisyon kaynaklarını tespit edin, emisyon envanterinizi uluslararası standartlarda kayıt altına almaya başlayın.',
    cta: 'Teklif Alın',
    ctaVariant: 'outlined',
    features: [
      '1 Tesis Girişi & 2 Kullanıcı Yetkisi',
      '2 Birebir Mühendislik Danışmanlığı Seansı',
      'Kapsam 1 ve Kapsam 2 Emisyon Envanter Hesabı',
      'ISO 14064-1 Metodolojisine Uygun Taslak Raporlama',
      'Yıllık Karbon Ayak İzi Özet Analitiği',
      'Karbon Yönetimi Giriş ve Farkındalık Dokümantasyonu',
    ],
  },
  {
    key: 'standard',
    eyebrowIcon: Award,
    eyebrow: 'Standart Paket',
    title: 'Karbon & CBAM Standart',
    headline: 'AB İhracatçıları İçin Eksiksiz Karbon Yönetimi',
    audience: 'Düzenli AB ihracatı yapan orta ölçekli şirketler',
    description:
      'Tedarik zincirinizi kapsayan emisyon hesabı, ISO 14064 uyumlu raporlama ve şirket içi eğitimlerle AB standartlarına tam uyum sağlayın.',
    cta: 'Teklif Alın',
    ctaVariant: 'solid',
    featured: true,
    badge: 'En Çok Tercih Edilen',
    features: [
      '2 Tesis Girişi & 5 Kullanıcı Yetkisi',
      '5 Teknik Mühendislik Danışmanlık Seansı',
      'Kapsam 1, Kapsam 2 ve Kapsam 3 (Tedarik Zinciri) Hesabı',
      'GHG Protocol & ISO 14064-1 Tam Beyan Raporu',
      'Aylık ve Çeyreklik Dinamik Trend Takip Paneli',
      'Şirket Personeline Özel Kurumsal Sürdürülebilirlik Eğitimi',
      'Tedarikçi Veri Toplama Şablonları ve Desteği',
    ],
  },
  {
    key: 'professional',
    eyebrowIcon: Factory,
    eyebrow: 'Profesyonel Paket',
    title: 'Kurumsal & SKDM Profesyonel',
    headline: 'Sınırda Karbon Riski Taşıyan Büyük Sanayi Tesisleri İçin',
    audience: 'Çoklu tesis ve yüksek ihracat hacmine sahip sanayi kuruluşları',
    description:
      'Çoklu tesis yönetimi, ürün bazlı karbon ayak izi (PCF), CBAM vergi maliyeti simülasyonu ve akredite doğrulama süreçlerine tam hazırlık.',
    cta: 'Teklif Alın',
    ctaVariant: 'outlined',
    features: [
      'Sınırsız Tesis Girişi & 15 Kullanıcı Yetkisi',
      '12 Uzman Mühendis & Başdenetçi Danışmanlığı',
      'Kapsam 1, 2, 3 + Ürün Bazlı Karbon Ayak İzi (PCF)',
      'Resmi SKDM / CBAM Beyan ve Doğrulama Raporu',
      'Canlı Karbon Azaltım Senaryoları & Simülasyon Modülü',
      'Tahmini AB CBAM Vergi Yükü Hesabı ve Mali Risk Analizi',
      'ISO 14064-1 Akredite Onay Süreçlerine Birebir Eşlik',
    ],
  },
]

type Props = {
  onSelectPackage: (pkg: PricingPackage) => void
  className?: string
}

export const PricingPackages: FC<Props> = ({ onSelectPackage, className }) => {
  return (
    <section
      id="pricing"
      className={cn(
        'relative scroll-mt-[100px] w-full bg-slate-50 border-y border-slate-200/80',
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-[64rem] max-w-[90vw] h-40 bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl rounded-[50%]" />
      </div>

      <div className="container-x relative section-padding py-14 sm:py-18 lg:py-22">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-emerald-200/80 px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-widest text-emerald-800">
              Size uygun danışmanlık seviyesi
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            KarbonKontrol Hizmet Paketleri
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              AB CBAM / SKDM uyumuna hazır olun
            </span>
          </h2>

          <p className="text-[14.5px] sm:text-base lg:text-[17px] leading-relaxed text-slate-700 max-w-2xl mx-auto">
            İşletmenizin ölçeğine ve ihracat hacmine göre doğru seviyeyi seçin. İlk analizden
            çoklu tesis yönetimine kadar ekibinizle birlikte ilerleyen bir yol haritası oluşturalım.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PRICING_PACKAGES.map((pkg) => {
            const EyebrowIcon = pkg.eyebrowIcon
            return (
              <article
                key={pkg.key}
                className={cn(
                  'relative group flex flex-col w-full h-full bg-white border border-[#ffcb7d] rounded-3xl overflow-hidden transition-all duration-300 shadow-sm',
                  pkg.featured
                    ? 'border-2 shadow-[0_20px_45px_-12px_rgba(0,79,79,0.28)] -translate-y-2 lg:-translate-y-3'
                    : 'shadow-soft hover:shadow-lg hover:-translate-y-0.5',
                )}
              >
                {pkg.featured && pkg.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex h-[76px] w-[76px] rotate-3 flex-col items-center justify-center gap-1 rounded-full border-4 border-[#fff1bd] bg-gradient-to-br from-[#ffe9a3] via-[#ffcb7d] to-[#d99a32] px-2 text-center text-[9px] font-extrabold uppercase leading-tight tracking-wide text-[#704600] shadow-[0_8px_18px_-6px_rgba(151,94,10,0.7)]">
                      <Award className="w-3.5 h-3.5" />
                      <span>{pkg.badge}</span>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'px-5 pr-24 pt-6 pb-5 sm:px-7 sm:pr-28 sm:pt-7 sm:pb-6 border-b transition-colors',
                    pkg.featured
                      ? 'bg-gradient-to-b from-[#004f4f] via-[#00635f] to-[#004f4f] border-[#ffcb7d]/70 text-white'
                      : 'bg-gradient-to-b from-slate-50 via-white to-white border-slate-100 text-slate-900',
                  )}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-3 py-1 border mb-3',
                      pkg.featured
                        ? 'bg-white/10 border-white/20 text-emerald-50'
                        : 'bg-emerald-50 border-emerald-200/80 text-emerald-800',
                    )}
                  >
                    <EyebrowIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11.5px] font-bold uppercase tracking-widest">
                      {pkg.eyebrow}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'text-lg sm:text-xl font-extrabold tracking-tight leading-tight mb-1.5',
                    )}
                  >
                    {pkg.title}
                  </h3>
                  <p
                    className={cn(
                      'text-[13.5px] sm:text-[14.5px] font-semibold leading-snug',
                      pkg.featured ? 'text-emerald-50/95' : 'text-emerald-800',
                    )}
                  >
                    {pkg.headline}
                  </p>
                  <div
                    className={cn(
                      'mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-[12px] font-bold leading-snug',
                      pkg.featured
                        ? 'bg-white/10 text-white border border-white/15'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-100',
                    )}
                  >
                    <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{pkg.audience}</span>
                  </div>
                  <p
                    className={cn(
                      'mt-2.5 text-[13px] sm:text-[14px] leading-relaxed',
                      pkg.featured ? 'text-emerald-50/85' : 'text-slate-600',
                    )}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className="flex-1 flex flex-col px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
                  <ul className="space-y-2.5 sm:space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex gap-2.5 items-start min-h-0">
                        <span
                          className={cn(
                            'shrink-0 inline-flex items-center justify-center rounded-full mt-0.5',
                            pkg.featured
                              ? 'h-6 w-6 bg-emerald-100 text-[#004f4f]'
                              : 'h-6 w-6 bg-emerald-50 text-emerald-700 border border-emerald-100',
                          )}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <span className="text-[13.5px] sm:text-[14px] leading-relaxed text-slate-700 pt-0.5">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 sm:pt-6">
                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className={cn(
                        'group relative w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] sm:text-base font-extrabold transition-all duration-200 focus:outline-none focus-visible:ring-4',
                        pkg.ctaVariant === 'solid'
                          ? 'bg-[#004f4f] text-[#ffffd9] shadow-lg shadow-emerald-900/20 hover:brightness-110 active:scale-[0.99] focus-visible:ring-emerald-400/40'
                          : 'bg-white text-[#004f4f] border-2 border-[#004f4f] hover:bg-[#004f4f] hover:text-[#ffffd9] active:scale-[0.99] focus-visible:ring-emerald-400/40',
                      )}
                    >
                      <Building2 className="w-4.5 h-4.5" />
                      {pkg.cta} <span className="text-xs font-semibold opacity-75">→</span>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PricingPackages
