import { useRef } from 'react'
import { useIntersectionReveal } from '../../../hooks/useIntersectionReveal'
import styles from './Timeline.module.css'

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  useIntersectionReveal(sectionRef)

  return (
    <section id="timeline" ref={sectionRef} aria-labelledby="timeline-heading">
      <div className="container">
        <p className="label reveal">
          <span className="label-num">03</span>
          <span className="label-line" />
          Flight Log
        </p>

        <h2 id="timeline-heading" className="h2 reveal reveal-d1">
          The <em>journey</em> so far.
        </h2>

        <div className={styles.timelineWrap}>

          <div className={`${styles.tlItem} reveal`}>
            <div className={styles.tlYear}>2026 → Beyond</div>
            <h3 className={styles.tlTitle}>Full-Stack Engineer</h3>
            <p className={styles.tlDesc}>
              The mission: own the whole stack. Build products end-to-end, architect
              backend services as confidently as shipping an iOS app.
            </p>
            <span className={styles.tlBadge}>
              <span className={styles.tlBadgeDot} aria-hidden="true" />
              Incoming
            </span>
          </div>

          <div className={`${styles.tlItem} reveal reveal-d1`}>
            <div className={styles.tlYear}>2025 — Present</div>
            <h3 className={styles.tlTitle}>Learning Golang &amp; Backend</h3>
            <p className={styles.tlDesc}>
              Self-directed deep dive into Go. Building pet projects — REST APIs,
              CLI tools, exploring concurrency patterns and distributed systems concepts.
            </p>
            <span className={styles.tlBadge}>
              <span className={styles.tlBadgeDot} aria-hidden="true" />
              Active Mission
            </span>
          </div>

          <div className={`${styles.tlItem} reveal reveal-d2`}>
            <div className={styles.tlYear}>2021 — Present</div>
            <h3 className={styles.tlTitle}>Senior iOS Developer</h3>
            <p className={styles.tlDesc}>
              Led feature development, set architecture standards, mentored team members.
              Shipped major product updates reaching millions of users in production.
            </p>
          </div>

          <div className={`${styles.tlItem} reveal reveal-d3`}>
            <div className={styles.tlYear}>2019 — 2021</div>
            <h3 className={styles.tlTitle}>iOS Developer</h3>
            <p className={styles.tlDesc}>
              Shipped 3 production applications to the App Store. Migrated legacy UIKit
              codebases to SwiftUI. First deep encounters with performance profiling and Instruments.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
