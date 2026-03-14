import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionReveal } from '../../../hooks/useIntersectionReveal'
import styles from './AILab.module.css'

export default function AILab() {
  const sectionRef = useRef<HTMLElement>(null)
  useIntersectionReveal(sectionRef)

  return (
    <section id="ai-lab" ref={sectionRef} aria-labelledby="ai-lab-heading">
      <div className="container">

        {/* Header */}
        <div className={styles.aiLabHeader}>
          <p className="label reveal" style={{ justifyContent: 'center' }}>
            <span className="label-num">04</span>
            <span className="label-line" />
            AI Lab
          </p>

          <h2 id="ai-lab-heading" className="h2 reveal reveal-d1">
            AI Image<br /><em>Generation</em>
          </h2>

          <div className="reveal reveal-d2" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-5)' }}>
            <span className={styles.aiLabBadge}>
              <span className={styles.aiLabBadgeIcon} aria-hidden="true">✦</span>
              Google Gemini 2.5 Flash
            </span>
          </div>

          <p className={`${styles.aiLabSub} reveal reveal-d3`}>
            Describe anything — a landscape, a character, a scene —
            and watch Gemini render it in seconds.
          </p>
        </div>

        {/* Image preview grid */}
        <div className={styles.aiLabImageGrid}>
          <Link
            to="/generate"
            className={`${styles.aiLabImageCard} ${styles.aiLabImageCard1} reveal reveal-d2`}
            aria-label="Open AI image generator — purple nebula preview"
          >
            <div className={styles.aiLabCardOverlay} aria-hidden="true">
              <span>Generate →</span>
            </div>
          </Link>

          <Link
            to="/generate"
            className={`${styles.aiLabImageCard} ${styles.aiLabImageCard2} reveal reveal-d3`}
            aria-label="Open AI image generator — cyan wave preview"
          >
            <div className={styles.aiLabCardOverlay} aria-hidden="true">
              <span>Generate →</span>
            </div>
          </Link>

          <Link
            to="/generate"
            className={`${styles.aiLabImageCard} ${styles.aiLabImageCard3} reveal reveal-d4`}
            aria-label="Open AI image generator — gold warm preview"
          >
            <div className={styles.aiLabCardOverlay} aria-hidden="true">
              <span>Generate →</span>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className={`${styles.aiLabCta} reveal reveal-d5`}>
          <Link to="/generate" className="btn btn-primary">
            Open Generator →
          </Link>
        </div>

      </div>
    </section>
  )
}
