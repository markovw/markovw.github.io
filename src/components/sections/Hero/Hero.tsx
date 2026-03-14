import { scrollToSection } from '../../../utils/scrollToSection'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <div id="hero" className={styles.hero} role="banner">
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <div className={styles.heroBadgeDot} aria-hidden="true" />
          Software Engineer · iOS &amp; Backend
        </div>

        <h1 className={styles.heroName}>markovw</h1>

        <p className={styles.heroSub}>
          <strong>5 years</strong> shaping iOS experiences.
          Now navigating the backend universe with <strong>Golang.</strong>
        </p>

        <div className={styles.heroCta}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToSection('#about')}
          >
            Explore Mission
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToSection('#timeline')}
          >
            View Journey
          </button>
        </div>
      </div>

      <div className={styles.heroScrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb} />
        </div>
      </div>
    </div>
  )
}
