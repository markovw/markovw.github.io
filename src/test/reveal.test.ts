import { describe, expect, it } from 'vitest'
import { shouldRevealElement } from '../hooks/reveal'

describe('shouldRevealElement', () => {
  it('reveals elements that are already inside the viewport band', () => {
    expect(
      shouldRevealElement({ top: 620, bottom: 920 }, 900)
    ).toBe(true)
  })

  it('does not reveal elements that are still below the viewport trigger zone', () => {
    expect(
      shouldRevealElement({ top: 860, bottom: 1160 }, 900)
    ).toBe(false)
  })

  it('does not reveal elements that have already scrolled past the viewport', () => {
    expect(
      shouldRevealElement({ top: -320, bottom: -20 }, 900)
    ).toBe(false)
  })
})
