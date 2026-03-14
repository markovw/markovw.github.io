import type { ReactNode } from 'react'

type TagColor = 'cyan' | 'violet' | 'gold' | 'pink' | 'green'

const colorClass: Record<TagColor, string> = {
  cyan:   'tag-c',
  violet: 'tag-v',
  gold:   'tag-g',
  pink:   'tag-p',
  green:  'tag-n',
}

interface TagProps {
  color?: TagColor
  children: ReactNode
}

export default function Tag({ color = 'cyan', children }: TagProps) {
  return (
    <span className={`tag ${colorClass[color]}`}>
      {children}
    </span>
  )
}
