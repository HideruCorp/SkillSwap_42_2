import React from 'react';
import { SkillTagUI } from '@shared/ui/skill-tag';
import Button from '@shared/ui/button/Button';
import styles from './user-card.module.scss';
import type { UserCardProps } from './types';

function UserCard({
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
          onClick={onLikeClick}
          aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
        >
          <div
            className={`${styles.likeIcon} ${isLiked ? styles.likeIconActive : styles.likeIconDefault}`}
          />
        </button>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <div className={styles.skillsList}>
          {canTeach.map((skill) => (
            <SkillTagUI key={`can-${skill}`} bgColor="#EEE7F7" text={skill} />
          ))}
        </div>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <div className={styles.skillsList}>
          {wantsToLearn.slice(0, 2).map((skill) => (
            <SkillTagUI key={`want-${skill}`} bgColor="#E9F7E7" text={skill} />
          ))}
          {wantsToLearn.length > 2 && (
            <span className={styles.moreSkills}>+{wantsToLearn.length - 2}</span>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button title="Подробнее" onClick={() => onDetailsClick?.()} type="default" />
      </div>
    </div>
  );
}

export default UserCard;
