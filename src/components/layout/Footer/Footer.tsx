import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>
            Designed &amp; built by <span>Markov</span>
          </p>
          <p className={styles.footerCopy}>
            <span>2026</span> · Software Engineer
          </p>
        </div>
      </div>
    </footer>
  )
}
