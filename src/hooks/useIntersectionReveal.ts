import { type RefObject, useEffect } from 'react'
import { shouldRevealElement } from './reveal'

export function useIntersectionReveal(containerRef: RefObject<Element | null>) {
  useEffect(() => {
    const els = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('.reveal') ?? [])
    if (els.length === 0) return

    const pending = new Set(els)

    const revealElement = (element: HTMLElement) => {
      element.classList.add('in')
      pending.delete(element)
      observer.unobserve(element)
    }

    const revealVisibleElements = () => {
      const viewportHeight = window.innerHeight
      pending.forEach((element) => {
        if (shouldRevealElement(element.getBoundingClientRect(), viewportHeight)) {
          revealElement(element)
        }
      })

      if (pending.size === 0) {
        window.removeEventListener('scroll', scheduleVisibilityCheck)
        window.removeEventListener('resize', scheduleVisibilityCheck)
      }
    }

    let rafId = 0
    const scheduleVisibilityCheck = () => {
      if (rafId !== 0) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        revealVisibleElements()
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const element = e.target as HTMLElement
          if (
            e.isIntersecting ||
            shouldRevealElement(element.getBoundingClientRect(), window.innerHeight)
          ) {
            revealElement(element)
          }
        })
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    els.forEach((el) => observer.observe(el))
    revealVisibleElements()
    window.addEventListener('scroll', scheduleVisibilityCheck, { passive: true })
    window.addEventListener('resize', scheduleVisibilityCheck, { passive: true })

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleVisibilityCheck)
      window.removeEventListener('resize', scheduleVisibilityCheck)
      observer.disconnect()
    }
  }, [containerRef])
}
