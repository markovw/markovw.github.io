import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Hero from '../components/sections/Hero/Hero'

describe('Hero', () => {
  it('renders the intro heading', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'markovw' })
    ).toBeInTheDocument()
  })

  it('scrolls to the about section from the primary CTA', () => {
    const about = document.createElement('div')
    about.id = 'about'
    const aboutScrollIntoView = vi.fn()
    Object.defineProperty(about, 'scrollIntoView', {
      writable: true,
      value: aboutScrollIntoView,
    })
    document.body.appendChild(about)

    render(<Hero />)

    fireEvent.click(screen.getByRole('button', { name: 'Explore Mission' }))

    expect(aboutScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })
})
