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
    const about = document.createElement('section')
    about.id = 'about'
    const label = document.createElement('p')
    label.className = 'label'
    const labelScrollIntoView = vi.fn()
    Object.defineProperty(label, 'scrollIntoView', {
      writable: true,
      value: labelScrollIntoView,
    })
    about.appendChild(label)
    document.body.appendChild(about)

    render(<Hero />)

    fireEvent.click(screen.getByRole('button', { name: 'Explore Mission' }))

    expect(labelScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })
})
