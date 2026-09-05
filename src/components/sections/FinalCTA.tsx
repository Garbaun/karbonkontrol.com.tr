import { Play } from 'lucide-react'

// 👇 Sadece buraya SENİN YouTube video ID'ni yaz (11 haneli: örn "AbCdEf12345")
// YouTube video URL'n: https://www.youtube.com/watch?v=BURAYA_ID
const YOUTUBE_VIDEO_ID = 'HGGxJvJkpPs'

// İsteğe bağlı video başlığı + açıklaması (SOL tarafta görünecek)
const VIDEO_HEADLINE = 'CBAM Nedir? 5 Dakikada İhracat Riskinizi Anlayın'
const VIDEO_SUBTITLE =
  'Eğitici videomuzda CBAM mekanizmasını, riskli sektörleri ve ihracatçının yapması gereken 5 adımı uzmanımız anlatıyor. Videoyu izleyin, sonunda form ile ücretsiz analiz alın.'
const VIDEO_BADGE = 'Eğitici Video'
const VIDEO_ESTIMATE = 'Süre: 4-6 dakika'

export default function FinalCTA() {
  const nocookieSrc = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`
  const posterThumb = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`

  return (
    <section id="contact" className="section-padding">
      <div className="container-x">
        <div
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center"
        >
          {/* SOL: Video başlık + açıklama (2 kolon) */}
          <div className="lg:col-span-2 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Play className="w-3.5 h-3.5" />
              {VIDEO_BADGE}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {VIDEO_HEADLINE}
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
              {VIDEO_SUBTITLE}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-slate-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {VIDEO_ESTIMATE}
              </div>
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 rounded-xl bg-cta-gradient px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                <span>Videodan Sonra Ücretsiz Hesapla</span>
              </a>
            </div>
          </div>

          {/* SAĞ: Video embed (3 kolon) — responsive 16:9, köşeler yuvarlak, gölge */}
          <div className="lg:col-span-3">
            <div className="group relative w-full rounded-3xl overflow-hidden border border-slate-200/70 shadow-[0_30px_80px_-20px_rgba(15,81,50,0.28)]">
              <div className="relative w-full aspect-video bg-slate-900">
                {/* Poster (yüksek çözünürlüklü YouTube kapak resmi) */}
                <img
                  src={posterThumb}
                  alt={VIDEO_HEADLINE}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.onerror = null
                    el.src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`
                  }}
                />
                {/* Hafif koyu overlay (video oynayınca gider) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/25 pointer-events-none" />
                {/* iframe (lazy, no-cookie gizlilik modu, ilgili videolar kapalı) */}
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={nocookieSrc}
                  title={VIDEO_HEADLINE}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
            {/* Video alt açıklama (küçük not) */}
            <p className="mt-4 text-xs md:text-sm text-slate-500 text-center lg:text-right font-medium">
              Bu video <span className="font-semibold text-slate-700">YouTube Gizlilik Modu</span> (youtube-nocookie.com) üzerinden izlenir — çerez izi bırakmaz.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
