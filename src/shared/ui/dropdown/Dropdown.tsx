import type { DropdownProps } from './types'
import { useEffect, useRef, useState } from 'react'
import styles from './dropdown.module.scss'

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className = '',
  menuClassName = '',
  isOpen: controlledIsOpen,
  onToggle,
  disableClickOutside = false,
  disableEscapeKey = false,
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const closeAndBlur = () => {
    if (!isControlled) {
      setInternalIsOpen(false)
    }
    onToggle?.(false)
    const active = document.activeElement as HTMLElement | null
    if (active && containerRef.current?.contains(active)) {
      active.blur()
    }
  }

  const handleToggle = () => {
    const newState = !isOpen
    if (!isControlled) {
      setInternalIsOpen(newState)
    }
    onToggle?.(newState)
  }

  // Закрытие по клику вне
  useEffect(() => {
    if (!isOpen || disableClickOutside)
      return undefined

    const handleClickOutside = (event: MouseEvent) => {
      event.stopPropagation()
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!isControlled) {
          setInternalIsOpen(false)
        }
        onToggle?.(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, disableClickOutside, isControlled, onToggle])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleToggle()
      return
    }
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      if (disableEscapeKey)
        return
      closeAndBlur()
    }
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      if (disableEscapeKey)
        return
      closeAndBlur()
    }
  }

  return (
    <div ref={containerRef} className={`${styles.dropdown} ${className}`}>
      <div
        className={styles.trigger}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`${styles.menu} ${styles[`menu--${align}`]} ${menuClassName}`}
          tabIndex={0}
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default Dropdown
