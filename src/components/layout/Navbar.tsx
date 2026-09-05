import { useEffect, useState } from 'react'
import { Globe, Menu, X, ChevronDown, UserCircle, PlayCircle, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IMAGES } from '@/assets/images'

const centerLinks: { label: string; href: string }[] = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Yeşil Yaprak', href: '#features' },
  { label: 'Blog', href: '#blog' },
]

const DEMO_BG = '#ffcb7d'
const DEMO_TEXT = '#3a2300'

type RightAction = {
  label: string
  variant: 'ghost' | 'secondary' | 'primary'
  href?: string
  dropdown?: boolean
}

interface NavbarProps {
  onPartnerClick?: () => void
}

export default function Navbar({ onPartnerClick }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }

  const renderRightButton = (action: RightAction, i: number) => {
    const Icon = i === 0 ? UserCircle : i === 1 ? PlayCircle : Languages
    if (action.variant === 'primary') {
      return (
        <a
          key={action.label}
          href={action.href || '#'}
          onClick={(e) => {
          if (action.href && action.href.startsWith('#')) {
            e.preventDefault()
            handleNavClick(action.href)
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-xl px-4 lg:px-5 py-2.5 text-sm font-bold shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: DEMO_BG, color: DEMO_TEXT, boxShadow: `0 10px 24px -12px rgba(255, 165, 79, 0.75)` }}
        >
          <Icon className="w-4 h-4" />
          {action.label}
        </a>
      )
    }
    if (action.variant === 'secondary') {
      return (
        <button
          key={action.label}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 px-3 lg:px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Icon className="w-4 h-4 text-white" />
          {action.label}
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        </button>
      )
    }
    return (
      <button
        key={action.label}
        type="button"
        onClick={() => onPartnerClick?.()}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
      >
        <Icon className="w-4 h-4 text-white/80" />
        {action.label}
        {action.dropdown && <ChevronDown className="w-3.5 h-3.5 text-white/70" />}
      </button>
    )
  }

  const rightActions: RightAction[] = [
    { label: 'Partner Girişi', variant: 'ghost', href: '#', dropdown: true },
    { label: 'Demo İste', variant: 'primary', href: '#calculator' },
    { label: 'Dil Seçimi', variant: 'secondary', dropdown: true },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-lg shadow-card-hover'
            : 'backdrop-blur-md'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(0, 79, 79, 0.92)' : 'rgba(0, 79, 79, 0.82)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        }}
      >
        <div className="container-x h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Sol: Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#hero')
            }}
            className="flex items-center shrink-0 group"
            aria-label="KarbonKontrol ana sayfa"
          >
            <img
              src={IMAGES.logoYatay}
              alt="KarbonKontrol Logo"
              className="h-[43px] md:h-[53px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          {/* Orta: Nav linkleri (sadece md+) */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2 flex-1">
            {centerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-white hover:bg-white/10"
              >
                {link.label}
                <span className="absolute left-1/2 -bottom-0.5 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-8 hover:w-8" />
              </a>
            ))}
          </nav>

          {/* Sağ: Butonlar (sadece md+) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            {rightActions.map((a, i) => renderRightButton(a, i))}
          </div>

          {/* Mobil Hamburger (md altında) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobil Bottom-Sheet Menü */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 max-h-[88vh] bg-white rounded-t-3xl shadow-card-hover border-t border-slate-200/60 flex flex-col transition-transform duration-300 ease-out overflow-hidden',
            mobileOpen ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-slate-200" />
          </div>
          <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200/60">
            <p className="text-base font-bold text-[#2c3135]">Menü</p>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#2c3135] transition-colors active:scale-95"
              aria-label="Menüyü kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {centerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="group flex items-center justify-between rounded-2xl px-4 py-4 text-base font-semibold text-[#2c3135] hover:text-brand-700 hover:bg-brand-50/60 transition-all duration-300"
              >
                {link.label}
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 group-hover:text-brand-500 transition-colors" />
              </a>
            ))}
            <div className="h-px bg-slate-100 my-3" />
            {rightActions.map((action, i) => {
              const Icon = i === 0 ? UserCircle : i === 1 ? PlayCircle : Globe
              const base =
                'w-full inline-flex items-center gap-2 rounded-2xl px-4 py-4 text-base font-semibold transition-all duration-300'
              if (action.variant === 'primary') {
                return (
                  <a
                    key={action.label}
                    href={action.href || '#'}
                    onClick={(e) => {
                      if (action.href?.startsWith('#')) {
                        e.preventDefault()
                        setMobileOpen(false)
                        setTimeout(() => handleNavClick(action.href as string), 220)
                      }
                    }}
                    className={cn(
                      base,
                      'justify-center text-white shadow-lg hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]'
                    )}
                    style={{ backgroundColor: DEMO_BG, color: DEMO_TEXT, boxShadow: `0 10px 24px -12px rgba(255, 165, 79, 0.65)` }}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </a>
                )
              }
              if (action.label === 'Partner Girişi') {
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setTimeout(() => onPartnerClick?.(), 220)
                    }}
                    className={cn(base, 'justify-between text-[#2c3135] hover:bg-brand-50 hover:text-brand-700')}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-700" />
                      <span className="font-extrabold">{action.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-700 px-2 py-0.5 rounded-full">
                        Yeni
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                )
              }
              return (
                <button
                  key={action.label}
                  type="button"
                  className={cn(base, 'justify-between text-[#2c3135] hover:bg-slate-50 hover:text-brand-700')}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    {action.label}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
