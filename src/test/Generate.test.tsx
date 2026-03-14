import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Generate from '../pages/Generate/Generate'

describe('Generate', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 800,
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      data: 'ZmFrZQ==',
                      mimeType: 'image/png',
                    },
                  },
                ],
              },
            },
          ],
        }),
      })
    )
  })

  it('scrolls the generated image into the viewport center when it loads off-center', async () => {
    render(
      <MemoryRouter>
        <Generate />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Image prompt' }), {
      target: { value: 'orbital station' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    const img = await screen.findByRole('img', { name: 'Generated: orbital station' })
    const wrap = img.parentElement as HTMLDivElement
    const scrollIntoView = vi.fn()

    Object.defineProperty(wrap, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 680,
        bottom: 1080,
        left: 0,
        right: 320,
        width: 320,
        height: 400,
        x: 0,
        y: 680,
        toJSON() {
          return this
        },
      }),
    })

    Object.defineProperty(wrap, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollIntoView,
    })

    fireEvent.load(img)

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      })
    })
  })

  it('does not scroll the generated image when it already loads near viewport center', async () => {
    render(
      <MemoryRouter>
        <Generate />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Image prompt' }), {
      target: { value: 'nebula bridge' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    const img = await screen.findByRole('img', { name: 'Generated: nebula bridge' })
    const wrap = img.parentElement as HTMLDivElement
    const scrollIntoView = vi.fn()

    Object.defineProperty(wrap, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 220,
        bottom: 620,
        left: 0,
        right: 320,
        width: 320,
        height: 400,
        x: 0,
        y: 220,
        toJSON() {
          return this
        },
      }),
    })

    Object.defineProperty(wrap, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollIntoView,
    })

    fireEvent.load(img)

    await waitFor(() => {
      expect(scrollIntoView).not.toHaveBeenCalled()
    })
  })
})
