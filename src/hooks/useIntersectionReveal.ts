import { type RefObject, useEffect } from 'react'

export function useIntersectionReveal(containerRef: RefObject<Element | null>) {
  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.reveal') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [containerRef])
}
