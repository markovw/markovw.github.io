import { useRef, useEffect, type MouseEvent } from 'react'
import { useIntersectionReveal } from '../../../hooks/useIntersectionReveal'
import styles from './Skills.module.css'

interface ProgressItem {
  label: string
  pct: string
  val: number
}

const PROGRESS_ITEMS: ProgressItem[] = [
  { label: 'Go Fundamentals',    pct: '92%', val: 0.92 },
  { label: 'REST API Design',    pct: '78%', val: 0.78 },
  { label: 'Database & SQL',     pct: '65%', val: 0.65 },
  { label: 'Distributed Systems',pct: '40%', val: 0.40 },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const activeMissionRef = useRef<HTMLDivElement>(null)
  useIntersectionReveal(sectionRef)

  // Card spotlight (desktop only)
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile || !sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll<HTMLElement>(`.${styles.card}`)
    const handlers = new Map<HTMLElement, (e: Event) => void>()

    cards.forEach((card) => {
      const handler = (e: Event) => {
        const mouseE = e as globalThis.MouseEvent
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', (mouseE.clientX - r.left) + 'px')
        card.style.setProperty('--my', (mouseE.clientY - r.top) + 'px')
      }
      handlers.set(card, handler)
      card.addEventListener('mousemove', handler)
    })

    return () => {
      handlers.forEach((handler, card) => {
        card.removeEventListener('mousemove', handler)
      })
    }
  }, [])

  // Progress bar reveal
  useEffect(() => {
    const el = activeMissionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const fills = el.querySelectorAll<HTMLElement>(`.${styles.progressFill}`)
          fills.forEach((bar, i) => {
            const val = parseFloat(bar.dataset.val ?? '0')
            setTimeout(() => {
              bar.style.transform = `scaleX(${val})`
            }, 200 + i * 120)
          })
          observer.unobserve(el)
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px')
    card.style.setProperty('--my', (e.clientY - r.top) + 'px')
  }

  return (
    <section id="skills" ref={sectionRef} aria-labelledby="skills-heading">
      <div className="container">
        <p className="label reveal">
          <span className="label-num">02</span>
          <span className="label-line" />
          Tech Arsenal
        </p>

        <h2 id="skills-heading" className="h2 reveal reveal-d1">
          Tools of the <em>trade.</em>
        </h2>

        <div className={styles.skillsGrid}>

          <div className={`${styles.card} reveal reveal-d1`} onMouseMove={handleMouseMove}>
            <div className={`${styles.cardIcon} ${styles.iconCyan}`}>📱</div>
            <h3>iOS Development</h3>
            <p>Native Apple platform engineering. Architecture decisions, App Store submissions, and everything in between.</p>
            <div className={styles.tags}>
              <span className="tag tag-c">Swift</span>
              <span className="tag tag-c">SwiftUI</span>
              <span className="tag tag-c">UIKit</span>
              <span className="tag tag-c">Combine</span>
            </div>
          </div>

          <div className={`${styles.card} reveal reveal-d2`} onMouseMove={handleMouseMove}>
            <div className={`${styles.cardIcon} ${styles.iconViolet}`}>⚡</div>
            <h3>Architecture</h3>
            <p>MVVM, Clean Architecture, dependency injection. Systems that scale and stay maintainable under pressure.</p>
            <div className={styles.tags}>
              <span className="tag tag-v">MVVM</span>
              <span className="tag tag-v">Clean Arch</span>
              <span className="tag tag-v">DI</span>
              <span className="tag tag-v">TDD</span>
            </div>
          </div>

          <div className={`${styles.card} reveal reveal-d3`} onMouseMove={handleMouseMove}>
            <div className={`${styles.cardIcon} ${styles.iconGold}`}>⚙️</div>
            <h3>Tooling &amp; CI</h3>
            <p>Git workflows, CI/CD pipelines, Instruments profiling, automated testing. The full engineering loop.</p>
            <div className={styles.tags}>
              <span className="tag tag-g">Git</span>
              <span className="tag tag-g">CI/CD</span>
              <span className="tag tag-g">XCTest</span>
              <span className="tag tag-g">Fastlane</span>
            </div>
          </div>

          {/* Wide featured card */}
          <div
            id="active-mission"
            ref={activeMissionRef}
            className={`${styles.card} ${styles.cardWide} reveal reveal-d1`}
            onMouseMove={handleMouseMove}
          >
            <div>
              <div className={`${styles.cardIcon} ${styles.iconCyan}`}>🦫</div>
              <h3>Active Mission — Golang &amp; Backend</h3>
              <p>
                Deep in the Go ecosystem. Building real projects: REST APIs, CLI tools,
                concurrent systems. Learning the patterns that power the backend world.
              </p>
              <div className={styles.tags}>
                <span className="tag tag-c">Go</span>
                <span className="tag tag-c">net/http</span>
                <span className="tag tag-v">PostgreSQL</span>
                <span className="tag tag-v">Docker</span>
                <span className="tag tag-g">REST APIs</span>
                <span className="tag tag-n">Linux</span>
              </div>
            </div>

            <div>
              <p className={styles.progressSectionLabel}>Learning trajectory</p>
              {PROGRESS_ITEMS.map((item) => (
                <div key={item.label} className={styles.progressItem}>
                  <div className={styles.progressMeta}>
                    <span>{item.label}</span>
                    <span>{item.pct}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      data-val={item.val}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.card} reveal reveal-d2`} onMouseMove={handleMouseMove}>
            <div className={`${styles.cardIcon} ${styles.iconPink}`}>🗄️</div>
            <h3>Databases</h3>
            <p>Relational stores and key-value caches. Writing queries that perform, schemas that make sense.</p>
            <div className={styles.tags}>
              <span className="tag tag-p">PostgreSQL</span>
              <span className="tag tag-p">SQLite</span>
              <span className="tag tag-p">Redis</span>
            </div>
          </div>

          <div className={`${styles.card} reveal reveal-d3`} onMouseMove={handleMouseMove}>
            <div className={`${styles.cardIcon} ${styles.iconGreen}`}>🐳</div>
            <h3>Infrastructure</h3>
            <p>Containerized deployments, basic cloud setups. Bridging the gap from local to production.</p>
            <div className={styles.tags}>
              <span className="tag tag-n">Docker</span>
              <span className="tag tag-n">Nginx</span>
              <span className="tag tag-n">Linux</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
