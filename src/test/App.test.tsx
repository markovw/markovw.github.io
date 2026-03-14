import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

vi.mock('../components/background/Starfield/Starfield', () => ({
  default: () => <div data-testid="starfield" />,
}))

vi.mock('../components/background/Nebula/Nebula', () => ({
  default: () => <div data-testid="nebula" />,
}))

vi.mock('../pages/Home/Home', () => ({
  default: () => <div>Home</div>,
}))

vi.mock('../pages/Generate/Generate', () => ({
  default: () => <div>Generate</div>,
}))

function AppHarness() {
  const navigate = useNavigate()

  return (
    <>
      <button type="button" onClick={() => navigate('/generate')}>
        Go generate
      </button>
      <button type="button" onClick={() => navigate('/')}>
        Go home
      </button>
      <App />
    </>
  )
}

describe('App scroll restoration', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 0,
    })
  })

  it('starts at the top on a fresh home load even with stale saved scroll', () => {
    sessionStorage.setItem('index_scroll_y', '640')

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('restores the saved scroll position when returning home from another route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppHarness />
      </MemoryRouter>
    )

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 420,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Go generate' }))
    expect(sessionStorage.getItem('index_scroll_y')).toBe('420')

    vi.mocked(window.scrollTo).mockClear()

    fireEvent.click(screen.getByRole('button', { name: 'Go home' }))
    expect(window.scrollTo).toHaveBeenCalledWith(0, 420)
  })
})
