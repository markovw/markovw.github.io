import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Starfield from './components/background/Starfield/Starfield'
import Nebula from './components/background/Nebula/Nebula'
import Home from './pages/Home/Home'
import Generate from './pages/Generate/Generate'

const SCROLL_KEY = 'index_scroll_y'

export default function App() {
  const location = useLocation()

  // Scroll restoration: when navigating back to Home, restore saved position
  useEffect(() => {
    if (location.pathname === '/') {
      const saved = sessionStorage.getItem(SCROLL_KEY)
      if (saved !== null) {
        const y = parseInt(saved, 10)
        // Double rAF ensures DOM is fully painted before scrolling
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo(0, y))
        )
      } else {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo(0, 0))
        )
      }
    }
  }, [location.pathname])

  // Save scroll position when leaving Home
  useEffect(() => {
    const handlePageHide = () => {
      if (location.pathname === '/') {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      }
    }
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [location.pathname])

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
