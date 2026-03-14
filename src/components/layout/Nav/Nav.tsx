import { useScrolled } from '../../../hooks/useScrolled'
import SignalOrb from '../SignalOrb/SignalOrb'
import styles from './Nav.module.css'

interface NavLink {
  label: string
  target: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'About',   target: '#about' },
  { label: 'Skills',  target: '#skills' },
  { label: 'Journey', target: '#timeline' },
  { label: 'AI Lab',  target: '#ai-lab' },
  { label: 'Contact', target: '#contact' },
]

export default function Nav() {
  const scrolled = useScrolled()

  function scrollToSection(target: string) {
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      id="nav"
      role="navigation"
      aria-label="Main navigation"
      className={scrolled ? styles.scrolled : undefined}
    >
      <div className="container">
        <div className={styles.navInner}>
          <a
            href="#hero"
            className={styles.navLogo}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#hero')
            }}
          >
            // markov.dev
          </a>

          {/* Desktop nav links */}
          <ul className={styles.navLinks} aria-label="Site sections">
            {NAV_LINKS.map((link) => (
              <li key={link.target}>
                <a
                  href={link.target}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.target)
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile: signal orb trigger */}
          <SignalOrb />
        </div>
      </div>
    </nav>
  )
}
