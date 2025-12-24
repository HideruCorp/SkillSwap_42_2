import type { ReactNode } from 'react'

export interface DropdownProps {
  /** Элемент-триггер, по клику на который открывается меню */
  trigger: ReactNode
  /** Содержимое выпадающего меню */
  children: ReactNode
  /** Выравнивание меню относительно триггера */
  align?: 'left' | 'right' | 'center'
  /** Дополнительный класс для контейнера */
  className?: string
  /** Дополнительный класс для меню */
  menuClassName?: string
  /** Контролируемое состояние открытия (опционально) */
  isOpen?: boolean
  /** Callback при изменении состояния открытия */
  onToggle?: (isOpen: boolean) => void
  /** Отключить автоматическое закрытие по клику вне */
  disableClickOutside?: boolean
  /** Отключить автоматическое закрытие по Escape */
  disableEscapeKey?: boolean
}
