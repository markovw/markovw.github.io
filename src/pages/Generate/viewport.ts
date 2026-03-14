interface RectLike {
  top: number
  bottom: number
}

const CENTER_TOLERANCE_RATIO = 0.18

export function shouldCenterElementInViewport(
  rect: RectLike,
  viewportHeight: number,
  toleranceRatio = CENTER_TOLERANCE_RATIO
) {
  const elementCenter = rect.top + (rect.bottom - rect.top) / 2
  const viewportCenter = viewportHeight / 2
  const tolerance = viewportHeight * toleranceRatio

  return Math.abs(elementCenter - viewportCenter) > tolerance
}
