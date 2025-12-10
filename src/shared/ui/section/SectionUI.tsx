import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI';
import UserCard from '@shared/ui/user-card/UserCard';
import styles from './section-ui.module.scss';
import type { SectionUIProps } from './type';

function SectionUI({
  title,
  cards,
  onAction,
  actionLabel,
  className,
  onLikeClick,
  onDetailsClick,
  triggerRef,
  hasMore,
}: SectionUIProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <SectionHeaderUI title={title} onAction={onAction} actionLabel={actionLabel} />

      {cards.length === 0 ? (
        <div className={styles.empty}>В этой секции пусто</div>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            {cards.map((card) => (
              <UserCard
                key={card.id}
                id={card.id}
                name={card.name}
                city={card.city}
                age={card.age}
                canTeach={card.canTeach}
                wantsToLearn={card.wantsToLearn}
                avatarUrl={card.avatarUrl ?? undefined}
                isLiked={card.isLiked}
                onDetailsClick={onDetailsClick ? () => onDetailsClick(card.id) : undefined}
                onLikeClick={onLikeClick ? () => onLikeClick(card.id) : undefined}
              />
            ))}
          </div>

          {hasMore && (
            <div ref={triggerRef} className={styles.trigger} />
          )}
        </>
      )}
    </section>
  );
}

export default SectionUI;
