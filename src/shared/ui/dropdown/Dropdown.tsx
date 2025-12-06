import { useState, useRef, useEffect } from 'react';
import styles from './dropdown.module.scss';
import type { DropdownProps } from './types';

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
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Управляемый или неуправляемый режим
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newState);
    }
    onToggle?.(newState);
  };

  // Закрытие по клику вне
  useEffect(() => {
    if (!isOpen || disableClickOutside) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!isControlled) {
          setInternalIsOpen(false);
        }
        onToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, disableClickOutside, isControlled, onToggle]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen || disableEscapeKey) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isControlled) {
          setInternalIsOpen(false);
        }
        onToggle?.(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, disableEscapeKey, isControlled, onToggle]);

  return (
    <div ref={containerRef} className={`${styles.dropdown} ${className}`}>
      <div
        className={styles.trigger}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </div>

      {isOpen && (
        <div className={`${styles.menu} ${styles[`menu--${align}`]} ${menuClassName}`} role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
