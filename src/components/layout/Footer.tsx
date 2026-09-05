import React from 'react'
import { Mail, Globe, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IMAGES } from '@/assets/images'

type LegalType = 'terms' | 'privacy' | 'cookies' | 'faq'

type FooterProps = {
  onLegalClick: (type: LegalType) => void
}

const quickLinks = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Yeşil Yaprak', href: '#features' },
  { label: 'Blog', href: '#about' },
  { label: 'CBAM Hesaplayıcı', href: '#calculator' },
]

const legalLinks: { label: string; type: LegalType }[] = [
  { label: 'Şartlar ve Koşullar', type: 'terms' },
  { label: 'Gizlilik Politikası ve KVKK', type: 'privacy' },
  { label: 'Çerez Politikası', type: 'cookies' },
  { label: 'SSS', type: 'faq' },
]

const socialLinks = [
  { label: 'LinkedIn', icon: 'linkedin', href: '#' },
  { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@KalibreSistem' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/kalibresistem' },
] as const

export default function Footer({ onLegalClick }: FooterProps) {
  return (
    <footer
      className="relative mt-auto overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGES.footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-white">
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center">
              <img
                src={IMAGES.logoYatay}
                alt="KarbonKontrol Logo"
                className="h-11 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-white opacity-82">
              KarbonKontrol markası, işletmelerin karbon ayak izlerini takip etmeleri,
              CBAM mevzuatına uyum sağlamaları ve sürdürülebilir bir gelecek için
              stratejik adımlar atmaları konusunda destek olur.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Hızlı Linkler
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      'group inline-flex items-center gap-2 text-sm text-white opacity-82',
                      'transition-all duration-300 hover:opacity-100 hover:bg-white/10 rounded-xl px-2 -mx-2 py-1.5'
                    )}
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Yasal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.type}>
                  <button
                    type="button"
                    onClick={() => onLegalClick(link.type)}
                    className={cn(
                      'group inline-flex items-center gap-2 text-sm text-left text-white opacity-82',
                      'transition-all duration-300 hover:opacity-100 hover:bg-white/10 rounded-xl px-2 -mx-2 py-1.5 w-full'
                    )}
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@karbonkontrol.com.tr"
                  title="Bilgi"
                  className="group inline-flex items-center gap-3 text-sm text-white opacity-82 hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/12 text-white group-hover:bg-white/20 group-hover:border-white/25 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span>info@karbonkontrol.com.tr</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:destek@karbonkontrol.com.tr"
                  title="Destek"
                  className="group inline-flex items-center gap-3 text-sm text-white opacity-82 hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/12 text-white group-hover:bg-white/20 group-hover:border-white/25 transition-all duration-300">
                    <ShieldIconMini className="w-4 h-4" />
                  </span>
                  <span>destek@karbonkontrol.com.tr</span>
                </a>
              </li>
              <li>
                <a
                  href="https://kalibresistem.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-3 text-sm text-white opacity-82 hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/12 text-white group-hover:bg-white/20 group-hover:border-white/25 transition-all duration-300">
                    <Globe className="w-4 h-4" />
                  </span>
                  <span>kalibresistem.com</span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider text-white opacity-70">
                Bizi Takip Edin
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-xl',
                      'bg-white/10 border border-white/12',
                      'hover:bg-white hover:border-white',
                      'hover:shadow-xl hover:-translate-y-0.5',
                      'transition-all duration-300'
                    )}
                  >
                    <SocialSvg name={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white opacity-65">
            © {new Date().getFullYear()} KarbonKontrol. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-1 justify-center">
            {legalLinks.map((l, idx) => (
              <React.Fragment key={l.type}>
                {idx > 0 && <span className="w-px h-4 bg-white/20 mx-1" />}
                <button
                  type="button"
                  onClick={() => onLegalClick(l.type)}
                  className="text-xs font-medium px-3 py-2 rounded-lg text-white opacity-72 hover:opacity-100 hover:bg-white/10 transition-all duration-200"
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function ShieldIconMini(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function SocialSvg({ name }: { name: 'linkedin' | 'youtube' | 'instagram' }) {
  const cls = 'w-4 h-4 text-white transition-colors duration-300 group-hover:text-[#004f4f] hover:text-[#004f4f]'
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z" />
      </svg>
    )
  }
  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
        <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.58A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.58a3.02 3.02 0 0 0 2.12-2.12 31.5 31.5 0 0 0 .5-5.8 31.5 31.5 0 0 0-.5-5.8zM9.6 15.6v-7.2l6.4 3.6-6.4 3.6z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
