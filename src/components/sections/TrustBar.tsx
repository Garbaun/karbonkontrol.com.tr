import { REFERANS_LOGOLAR } from '@/assets/images'

export function TrustBar() {
  const logos = REFERANS_LOGOLAR
  const doubled = [...logos, ...logos]

  return (
    <section
      aria-label="Referans Müşteriler"
      className="w-full overflow-hidden border-y border-slate-200/60 py-8 md:py-10"
      style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
    >
      {/* Marquee track */}
      <div className="relative w-full" aria-hidden>
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-5 md:gap-8 px-3 shrink-0">
            {doubled.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex items-center justify-center shrink-0 transition-all duration-500 hover:opacity-100 opacity-80 hover:opacity-100"
              >
                <img
                  src={src}
                  alt={`Referans firma logo ${i + 1}`}
                  loading="lazy"
                  className="h-[75 md:h-14 w-auto object-contain grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                  style={{
                    height: 'clamp(40px, 5.2vw, 78px)',
                    maxWidth: '220px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
