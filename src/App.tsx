import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Starfield from './components/background/Starfield/Starfield'
import Nebula from './components/background/Nebula/Nebula'
import Home from './pages/Home/Home'
import Generate from './pages/Generate/Generate'

const SCROLL_KEY = 'index_scroll_y'

export default function App() {
  const location = useLocation()
  const previousPathnameRef = useRef(location.pathname)

  // Fresh loads of "/" should start at the top so the hero stays visible.
  // Only restore when coming back to Home from another in-app route.
  useEffect(() => {
    const previousPathname = previousPathnameRef.current

    if (previousPathname === '/' && location.pathname !== '/') {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
    }

    if (location.pathname === '/') {
      const shouldRestore = previousPathname !== '/'
      const saved = shouldRestore ? sessionStorage.getItem(SCROLL_KEY) : null

      if (saved !== null) {
        const y = parseInt(saved, 10)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo(0, y))
        )
      } else {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo(0, 0))
        )
      }
    }
    previousPathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    const clearSavedScroll = () => {
      sessionStorage.removeItem(SCROLL_KEY)
    }

    window.addEventListener('beforeunload', clearSavedScroll)
    return () => window.removeEventListener('beforeunload', clearSavedScroll)
  }, [])

  return (
    <>
      {/* Persistent background layers — rendered outside routes */}
      <Starfield />
      <Nebula />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </>
  )
}
