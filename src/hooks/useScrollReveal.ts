import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseScrollRevealOptions {
  selector?: string
  once?: boolean
  start?: string
  end?: string
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const scope = useRef<HTMLElement | null>(null)
  const {
    selector = '[data-reveal]',
    once = true,
    start = 'top 85%',
  } = options

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector)

      elements.forEach((el, i) => {
        const delay = Number(el.getAttribute('data-delay') || 0) + i * 0.08
        const y = Number(el.getAttribute('data-y') || 30)
        const opacity = Number(el.getAttribute('data-opacity') ?? 0)

        gsap.fromTo(
          el,
          { y, opacity },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            },
          },
        )
      })
    }, scope)

    return () => ctx.revert()
  }, [selector, once, start])

  return { scope }
}
