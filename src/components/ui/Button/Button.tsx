import type { ReactNode, MouseEventHandler } from 'react'

type Variant = 'primary' | 'ghost'

interface ButtonProps {
  variant?: Variant
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  href?: string
  target?: string
  rel?: string
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  variant = 'primary',
  onClick,
  href,
  target,
  rel,
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const classes = `btn btn-${variant} ${className}`.trim()

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  )
}
