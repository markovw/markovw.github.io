import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SignalOrb from '../components/layout/SignalOrb/SignalOrb'

describe('SignalOrb', () => {
  it('opens the mobile navigation dialog when pressed', () => {
    render(<SignalOrb />)

    const button = screen.getByLabelText('Open navigation')
    fireEvent.click(button)

    expect(
      screen.getByLabelText('Close navigation')
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('dialog', { name: 'Site navigation' })
    ).toHaveAttribute('aria-hidden', 'false')
  })
})
