import styles from './tag-counter-ui.module.scss';
import type { TagCounterUIProps } from './type';
/**
 * TagCounterUI - Компонент для отображения счетчика навыков, можно подвязать колбэк на нажатие
 *
 * @param {TagCounterUIProps} props - Свойства компонента
 * @param {number} props.count - кол-во навыков для отображения
 * @param {() => void} props.onClick - Хендлер нажатия (опционален),
 *        если задан кнопка визуально реагирует на наведение и нажатие.
 *        Иначе просто ведет себя как индикатор
 *
 * @example
 * ```tsx
 * import { TagCounterUI } from '@shared/ui/tag-counter';
 *
 * function App() {
 *   const handleExpand = () => {
 *    // setIsExpanded(true);
 *   };
 *   return <TagCounterUI count={1} onClick={handleExpand} />;
 *   // return <TagCounterUI count={1} />;
 * }
 * ```
 */
export function TagCounterUI({ count, onClick }: TagCounterUIProps) {
  const className = onClick
    ? `${styles['tag-counter']} ${styles['tag-counter--clickable']}`
    : styles['tag-counter'];

  return (
    <button type="button" className={className} onClick={onClick}>
      +{count}
    </button>
  );
}

export default TagCounterUI;
