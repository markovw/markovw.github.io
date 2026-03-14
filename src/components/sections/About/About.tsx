import { useRef } from 'react'
import { useIntersectionReveal } from '../../../hooks/useIntersectionReveal'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  useIntersectionReveal(sectionRef)

  return (
    <section id="about" ref={sectionRef} aria-labelledby="about-heading">
      <div className="container">
        <div className={styles.aboutGrid}>

          {/* Text column */}
          <div className={styles.aboutBody}>
            <p className="label reveal">
              <span className="label-num">01</span>
              <span className="label-line" />
              Mission Brief
            </p>

            <h2 id="about-heading" className="h2 reveal reveal-d1">
              Building for <em>every layer</em><br />of the stack.
            </h2>

            <p className="reveal reveal-d2">
              Five years deep in the Apple ecosystem — UIKit, SwiftUI, Combine, CoreData.
              Shipped apps used by real humans, obsessed over performance, learned the hard
              lessons that only production teaches you.
            </p>

            <p className="reveal reveal-d3">
              Now expanding the mission. Golang caught my attention for its simplicity,
              performance, and the elegant way it handles concurrency. APIs, databases,
              distributed systems — the infrastructure behind every great app.
            </p>

            <p className="reveal reveal-d4">
              The goal: understand the full stack deeply enough to architect systems,
              not just consume them.
            </p>

            <div className={`${styles.statsGrid} reveal reveal-d5`} role="list">
              <div className={styles.statCard} role="listitem">
                <div className={styles.statNum}>5<sup>+</sup></div>
                <div className={styles.statDesc}>Years iOS</div>
              </div>
              <div className={styles.statCard} role="listitem">
                <div className={styles.statNum}>∞</div>
                <div className={styles.statDesc}>Curiosity</div>
              </div>
              <div className={styles.statCard} role="listitem">
                <div className={styles.statNum}>2<sup>×</sup></div>
                <div className={styles.statDesc}>Stack depth</div>
              </div>
            </div>
          </div>

          {/* Planet visual */}
          <div
            className={`${styles.planetScene} reveal reveal-d2`}
            aria-hidden="true"
          >
            <div className={styles.planet} />
            <div className={styles.ringWrap}>
              <div className={`${styles.ring} ${styles.ring1}`} />
              <div className={`${styles.ring} ${styles.ring2}`} />
            </div>
            <div className={styles.satelliteOrbit} />
            <div className={`${styles.glowDot} ${styles.glowDot1}`} />
            <div className={`${styles.glowDot} ${styles.glowDot2}`} />
            <div className={`${styles.glowDot} ${styles.glowDot3}`} />
          </div>

        </div>
      </div>
    </section>
  )
}
