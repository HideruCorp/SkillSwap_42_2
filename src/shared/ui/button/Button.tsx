import cn from 'classnames'
import React, { memo } from 'react'
import styles from './button.module.scss'

// Типы кнопок согласно дизайн-системе
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'default' | 'large'
export type HtmlType = 'button' | 'submit' | 'reset'

// Интерфейс для Button компонента
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Текст кнопки */
  title: string

  /** Вариант дизайна кнопки */
  variant?: ButtonVariant

  /** Размер кнопки */
  size?: ButtonSize

  /** HTML тип кнопки */
  htmlType?: HtmlType

  /** Иконка слева от текста */
  iconLeft?: React.ReactNode

  /** Иконка справа от текста */
  iconRight?: React.ReactNode

  /** Состояние загрузки */
  loading?: boolean

  /** Полная ширина кнопки */
  fullWidth?: boolean

  /** Обработчик клика */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Button компонент высокого качества с полной поддержкой дизайн-системы
 * Соответствует спецификациям из JSON и обеспечивает:
 * - Все состояния: default, hover, pressed, disabled, loading
 * - Поддержку иконок слева и справа
 * - ARIA атрибуты для accessibility
 * - Оптимизированный рендеринг с memo
 * - Responsive поведение
 */
function Button({ ref, title, variant = 'secondary', size = 'default', htmlType = 'button', iconLeft = null, iconRight = null, loading = false, fullWidth = false, className, onClick, disabled, id, role, tabIndex, style, title: titleAttr, type: htmlTypeProp, 'aria-disabled': ariaDisabled, 'aria-busy': ariaBusy, 'aria-label': ariaLabel, ...otherProps }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  // Вычисляем состояние кнопки
  const isDisabled = disabled || loading

  // Обработчик клика с отключением при disabled/loading
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <button
      ref={ref}
      type={htmlType === 'submit' ? 'submit' : 'button'}
      className={cn(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        {
          [styles['button--fullWidth']]: fullWidth,
          [styles['button--loading']]: loading,
          [styles['button--disabled']]: isDisabled,
        },
        className,
      )}
      onClick={handleClick}
      disabled={isDisabled}
      id={id}
      role={role}
      tabIndex={tabIndex}
      style={style}
      title={titleAttr}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={loading ? 'Загрузка...' : ariaLabel}
      {...otherProps}
    >
      {/* Контейнер для контента */}
      <span className={styles.content}>
        {/* Иконка слева */}
        {iconLeft && <span className={cn(styles.icon, styles.iconLeft)}>{iconLeft}</span>}

        {/* Текст кнопки */}
        <span className={styles.text}>{loading ? 'Загрузка...' : title}</span>

        {/* Иконка справа */}
        {iconRight && !loading && (
          <span className={cn(styles.icon, styles.iconRight)}>{iconRight}</span>
        )}

        {/* Спиннер загрузки */}
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <span className={styles.spinnerDot} />
            <span className={styles.spinnerDot} />
            <span className={styles.spinnerDot} />
          </span>
        )}
      </span>
    </button>
  )
}

Button.displayName = 'Button'

export default memo(Button)
