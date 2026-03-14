import { useRef, useEffect } from 'react'

interface Star {
  x: number
  y: number
  r: number
  base: number
  speed: number
  offset: number
  color: string
}

interface Meteor {
  x: number
  y: number
  len: number
  vx: number
  vy: number
  alpha: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    let W = 0
    let H = 0
    const STAR_COUNT = isMobile ? 100 : 250
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let raf = 0
    let time = 0
    let meteorInterval: ReturnType<typeof setInterval> | null = null
    let meteorTimeout: ReturnType<typeof setTimeout> | null = null

    function resize() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
    }

    function mkStar(): Star {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        base: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.008 + 0.002,
        offset: Math.random() * Math.PI * 2,
        color:
          Math.random() > 0.85
            ? 'rgba(129,140,248,'
            : 'rgba(248,250,252,',
      }
    }

    function initStars() {
      stars = Array.from({ length: STAR_COUNT }, mkStar)
    }

    function spawnMeteor() {
      if (meteors.length >= 2 || isMobile) return
      const startX = Math.random() * W * 0.6 + W * 0.1
      meteors.push({
        x: startX,
        y: Math.random() * H * 0.4,
        len: Math.random() * 140 + 80,
        vx: Math.random() * 5 + 5,
        vy: Math.random() * 3 + 2,
        alpha: 1,
      })
    }

    function draw() {
      if (prefersReducedMotion) return
      ctx!.clearRect(0, 0, W, H)
      time += 0.012

      // Stars
      for (const s of stars) {
        const a =
          s.base * (0.7 + 0.3 * Math.sin(time * s.speed * 60 + s.offset))
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = s.color + a + ')'
        ctx!.fill()
      }

      // Meteors
      meteors = meteors.filter((m) => m.alpha > 0)
      for (const m of meteors) {
        const dx = -m.len
        const dy = -(m.len * 0.4)
        const grad = ctx!.createLinearGradient(m.x, m.y, m.x + dx, m.y + dy)
        grad.addColorStop(0, `rgba(34,211,238,${m.alpha})`)
        grad.addColorStop(0.6, `rgba(129,140,248,${m.alpha * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx!.beginPath()
        ctx!.moveTo(m.x, m.y)
        ctx!.lineTo(m.x + dx, m.y + dy)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = 1.5
        ctx!.stroke()
        m.x += m.vx
        m.y += m.vy
        m.alpha -= 0.016
      }

      raf = requestAnimationFrame(draw)
    }

    function handleResize() {
      resize()
      initStars()
    }

    // Also apply parallax on scroll (desktop only)
    function handleScroll() {
      if (!prefersReducedMotion && !isMobile && canvas) {
        canvas.style.transform = `translateY(${window.scrollY * 0.12}px)`
      }
    }

    resize()
    initStars()

    if (!prefersReducedMotion) {
      draw()
      meteorInterval = setInterval(spawnMeteor, 4000)
      meteorTimeout = setTimeout(spawnMeteor, 1200)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      if (meteorInterval) clearInterval(meteorInterval)
      if (meteorTimeout) clearTimeout(meteorTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
