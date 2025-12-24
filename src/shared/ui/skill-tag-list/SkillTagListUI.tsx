import type { SkillTagListUIProps } from './type'
import { SkillTagUI } from '@shared/ui/skill-tag'
import { TagCounterUI } from '@shared/ui/tag-counter'
import { useLayoutEffect, useRef, useState } from 'react'
import styles from './skill-tag-list-ui.module.scss'

/**
 * SkillTagListUI - Компонент для отображения списка тегов навыков.
 * По умолчанию показывает только одну строку тегов, остальные скрывает за счетчиком.
 * По нажатию на счетчик раскрывает остальные строки.
 *
 * @param {SkillTagListUIProps} props - Свойства компонента
 * @param {SkillTag} props.tags - Теги скиллов для отображения
 *
 * @example
 * ```tsx
 * import { SkillTagListUI } from '@shared/ui/skill-tag-list';
 *
 * const tags = [
 *   { id: '1', text: 'Тайм менеджмент', bgColor: '#EEE7F7' },
 *   { id: '2', text: 'Медитация', bgColor: '#E9F7E7' },
 *   { id: '3', text: 'Йога', bgColor: '#E9F7E7' },
 *   { id: '4', text: 'Английский', bgColor: '#EBE5C5' },
 * ];
 *
 * function SomeComponent() {
 *   return (
 *     <div style={{ maxWidth: '300px', border: '1px solid red' }}>
 *       <SkillTagListUI tags={tags} />
 *     </div>
 *   );
 * }
 * ```
 */
export function SkillTagListUI({ tags }: SkillTagListUIProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(tags.length)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (isExpanded || !measureRef.current || !containerRef.current)
      return

    const containerWidth = containerRef.current.offsetWidth
    const gap = 4
    const counterWidth = 50 // примерная ширина кнопки "+N"

    const tagElements = measureRef.current.children
    let totalWidth = 0
    let fitCount = 0

    for (let i = 0; i < tagElements.length; i += 1) {
      const tagWidth = (tagElements[i] as HTMLElement).offsetWidth
      const nextWidth = totalWidth + tagWidth + (fitCount > 0 ? gap : 0)

      // Проверяем: если это не последний тег, оставляем место для счётчика
      const needsCounter = i < tagElements.length - 1
      const availableWidth = needsCounter ? containerWidth - counterWidth - gap : containerWidth

      if (nextWidth <= availableWidth) {
        totalWidth = nextWidth
        fitCount += 1
      } else {
        break
      }
    }

    setVisibleCount(fitCount)
  }, [tags, isExpanded])

  const handleExpand = () => {
    setIsExpanded(true)
    setVisibleCount(tags.length)
  }

  const hiddenCount = tags.length - visibleCount
  const displayedTags = isExpanded ? tags : tags.slice(0, visibleCount)

  return (
    <div ref={containerRef} className={styles['tag-list']}>
      {/* Скрытый контейнер для измерения */}
      <div ref={measureRef} className={styles['tag-list__measure']} aria-hidden="true">
        {tags.map((tag) => (
          <SkillTagUI key={tag.id} bgColor={tag.bgColor} text={tag.text} />
        ))}
      </div>

      {/* Видимые теги */}
      <div
        className={`${styles['tag-list__tags']} ${isExpanded ? styles['tag-list__tags--expanded'] : ''}`}
      >
        {displayedTags.map((tag) => (
          <SkillTagUI key={tag.id} bgColor={tag.bgColor} text={tag.text} />
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <TagCounterUI count={hiddenCount} onClick={handleExpand} />
        )}
      </div>
    </div>
  )
}

export default SkillTagListUI
