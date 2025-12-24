import type { ReactNode } from 'react'

export interface SectionUIProps {
  title: string
  children?: ReactNode
  onAction?: () => void
  actionLabel?: string
  className?: string
  triggerRef?: (node: HTMLDivElement | null) => void
  hasMore?: boolean
  headerExtra?: ReactNode // дополнительный элемент в заголовке
}
