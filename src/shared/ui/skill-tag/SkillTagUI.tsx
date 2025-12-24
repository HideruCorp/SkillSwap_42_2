import type { SkillTagUIProps } from './type'
import classNames from 'classnames'
import styles from './skill-tag-ui.module.scss'

const clsx = classNames.bind(styles)

/**
 * SkillTagUI - Компонент для отображения тега навыка с кастомным цветом фона
 *
 * @param {SkillTagUIProps} props - Свойства компонента
 * @param {string} props.bgColor - Цвет фона тега (hex, rgb, или любой валидный CSS цвет)
 * @param {string} props.text - Текст навыка для отображения
 *
 * @example
 * ```tsx
 * import { SkillTagUI } from '@shared/ui/skill-tag';
 *
 * function App() {
 *   return <SkillTagUI bgColor="#ebe5c5" text="Английский" />;
 * }
 * ```
 */
export function SkillTagUI({ bgColor, text, className }: SkillTagUIProps) {
  return (
    <span className={clsx(styles['skill-tag'], className)} style={{ backgroundColor: bgColor }}>
      {text}
    </span>
  )
}

export default SkillTagUI
