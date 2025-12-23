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

export { default as Button } from './Button';
export type { ButtonProps } from './Button';
export type { ButtonVariant, ButtonSize, HtmlType } from './Button';

// Переэкспорт типов для удобства использования
export type { ButtonVariant as Variant, ButtonSize as Size, HtmlType as Type } from './Button';
