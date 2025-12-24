/**
 * Button компонент - Полная реализация дизайн-системы
 *
 * Экспорты:
 * - Button - основной компонент
 * - ButtonProps - типы пропсов
 * - ButtonVariant - типы вариантов кнопки
 * - ButtonSize - типы размеров
 * - HtmlType - HTML типы кнопки
 */

export { default as Button } from './Button'
export type { ButtonProps } from './Button'
export type { ButtonSize, ButtonVariant, HtmlType } from './Button'

// Переэкспорт типов для удобства использования
export type { ButtonSize as Size, HtmlType as Type, ButtonVariant as Variant } from './Button'
