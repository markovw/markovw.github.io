import { useRef } from 'react'
import { useIntersectionReveal } from '../../../hooks/useIntersectionReveal'
import styles from './Contact.module.css'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  useIntersectionReveal(sectionRef)

  return (
    <section id="contact" ref={sectionRef} aria-labelledby="contact-heading">
      <div className={styles.contactGlow} aria-hidden="true" />
      <div className="container">
        <div className={styles.contactInner}>

          <p className="label reveal" style={{ justifyContent: 'center' }}>
            <span className="label-num">05</span>
            <span className="label-line" />
            Get in Touch
          </p>

          <h2 id="contact-heading" className={`${styles.contactHeading} reveal reveal-d1`}>
            Let&apos;s build something <em>together.</em>
          </h2>

          <p className={`${styles.contactSub} reveal reveal-d2`}>
            Open to backend roles, collaborations, and interesting projects.
          </p>

          <div className={`${styles.contactCta} reveal reveal-d3`}>
            <a
              href="https://t.me/markovw"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🚀 Message on Telegram
            </a>
            <a
              href="https://github.com/markovw"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              View on GitHub
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
