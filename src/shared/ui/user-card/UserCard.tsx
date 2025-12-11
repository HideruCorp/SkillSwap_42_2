import { SkillTagListUI } from '@shared/ui/skill-tag-list';
import Button from '@shared/ui/button/Button';
import styles from './user-card.module.scss';
import type { UserCardProps } from './types';

function UserCard({
  id, // добавлен id
  name,
  city,
  age,
  canTeach,
  wantsToLearn,
  avatarUrl,
  onDetailsClick,
  onLikeClick,
  isLiked = false,
}: UserCardProps) {
  const getAgeSuffix = (years: number): string => {
    if (years % 10 === 1 && years % 100 !== 11) return 'год';
    if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года';
    return 'лет';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{name.charAt(0).toUpperCase()}</div>
          )}
          <div className={styles.userInfo}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.location}>
              {city}, {age} {getAgeSuffix(age)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.likeButton}
          onClick={() => onLikeClick?.(id)}
          aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
        >
          <div
            className={`${styles.likeIcon} ${isLiked ? styles.likeIconActive : styles.likeIconDefault}`}
          />
        </button>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <SkillTagListUI tags={canTeach} />
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <SkillTagListUI tags={wantsToLearn} />
      </div>

      <div className={styles.footer}>

        <Button title="Подробнее" onClick={() => onDetailsClick?.(id)} type="default" />

      </div>
    </div>
  );
}

export default UserCard;
