import type { SectionUIProps } from './type'
import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI'
import styles from './SectionUI.module.scss'

function SectionUI({
  title,
  children,
  onAction,
  actionLabel,
  className,
  triggerRef,
  hasMore,
  headerExtra,
}: SectionUIProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <SectionHeaderUI
        title={title}
        onAction={onAction}
        actionLabel={actionLabel}
        extraAction={headerExtra}
      />

      {children == null || (Array.isArray(children) && children.length === 0)
        ? (
            <div className={styles.empty}>В этой секции пусто</div>
          )
        : (
            <>
              <div className={styles.cardsGrid}>{children}</div>

              {hasMore && <div ref={triggerRef} className={styles.trigger} />}
            </>
          )}
    </section>
  )
}

export default SectionUI
