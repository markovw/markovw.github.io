import { useState, useEffect, useRef, useCallback } from 'react'
import { scrollToSection } from '../../../utils/scrollToSection'
import styles from './SignalOrb.module.css'

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

const STAGGER_MS = 40

export default function SignalOrb() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const orbRef = useRef<HTMLButtonElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)

  const closeHud = useCallback(() => {
    if (!isOpen) return
    setIsOpen(false)
    setIsClosing(true)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false)
      closeTimerRef.current = null
    }, 200) // matches hudOut duration
  }, [isOpen])

  const openHud = useCallback(() => {
    if (isOpen) return
    // Clear any in-flight close animation
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
      setIsClosing(false)
    }
    setIsOpen(true)
  }, [isOpen])

  const toggle = useCallback(() => {
    if (isOpen) {
      closeHud()
      return
    }
    openHud()
  }, [isOpen, closeHud, openHud])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeHud()
        orbRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeHud])

  // Outside click
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (!isOpen) return
      const target = e.target as Node
      if (
        hudRef.current &&
        !hudRef.current.contains(target) &&
        orbRef.current &&
        !orbRef.current.contains(target)
      ) {
        closeHud()
      }
    }
    document.addEventListener('pointerdown', handler, { passive: true })
    return () => document.removeEventListener('pointerdown', handler)
  }, [isOpen, closeHud])

  // Breakpoint resize — force close on desktop
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) closeHud()
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [isOpen, closeHud])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  function handleLinkClick(target: string) {
    closeHud()
    // Slight delay so closing animation starts before scroll
    setTimeout(() => scrollToSection(target), 50)
  }

  const hudClass = [
    styles.navHud,
    isOpen && styles.navHudOpen,
    isClosing && styles.navHudClosing,
  ]
    .filter(Boolean)
    .join(' ')

  const orbClass = [styles.navOrb, isOpen && styles.navOrbOpen]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <button
        ref={orbRef}
        className={orbClass}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="nav-hud"
        type="button"
        onClick={toggle}
      >
        <span className={styles.navOrbIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.8l1.9 5.6 5.7 1.9-5.7 1.9-1.9 5.6-1.9-5.6-5.7-1.9 5.7-1.9L12 2.8z" />
          </svg>
        </span>
      </button>

      <div
        id="nav-hud"
        ref={hudRef}
        className={hudClass}
        role="dialog"
        aria-label="Site navigation"
        aria-modal="false"
        aria-hidden={!isOpen}
      >
        <ul className={styles.navHudList} role="list">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.target}
              style={
                isOpen
                  ? { animationDelay: `${i * STAGGER_MS}ms` }
                  : undefined
              }
            >
              <a
                href={link.target}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.target)
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.navHudDivider} aria-hidden="true" />
        <p className={styles.navHudFooter} aria-hidden="true">
          — markovw
        </p>
      </div>
    </>
  )
}
