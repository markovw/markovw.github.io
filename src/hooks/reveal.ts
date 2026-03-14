interface RevealRect {
  top: number
  bottom: number
}

const REVEAL_VIEWPORT_RATIO = 0.88

export function shouldRevealElement(
  rect: RevealRect,
  viewportHeight: number,
  viewportRatio = REVEAL_VIEWPORT_RATIO
) {
  return rect.top <= viewportHeight * viewportRatio && rect.bottom >= 0
}
