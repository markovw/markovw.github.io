function resolveScrollAnchor(section: HTMLElement): HTMLElement {
  if (section.id === 'hero') return section

  return (
    section.querySelector<HTMLElement>('[data-scroll-anchor], .label, h1, h2') ??
    section
  )
}

export function scrollToSection(target: string) {
  const section = document.querySelector<HTMLElement>(target)
  if (!section) return

  const anchor = resolveScrollAnchor(section)
  anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
