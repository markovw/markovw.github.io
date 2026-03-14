import type { CSSProperties } from 'react'

interface SectionLabelProps {
  number: string
  text: string
  className?: string
  style?: CSSProperties
}

export default function SectionLabel({
  number,
  text,
  className = '',
  style,
}: SectionLabelProps) {
  return (
    <p className={`label ${className}`.trim()} style={style}>
      <span className="label-num">{number}</span>
      <span className="label-line" />
      {text}
    </p>
  )
}
