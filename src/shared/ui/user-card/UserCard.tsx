import React from 'react';
import { SkillTagUI } from '@shared/ui/skill-tag';
import Button from '@shared/ui/button/Button';
import styles from './user-card.module.scss';
import type { UserCardProps } from './types';

const UserCard: React.FC<UserCardProps> = ({
  name,
  city,
  age,
  canTeach,
  wantsToLearn,
  avatarUrl,
  onDetailsClick,
  onLikeClick,
  isLiked = false,
}) => {
  const getAgeSuffix = (age: number): string => {
    if (age % 10 === 1 && age % 100 !== 11) return 'год';
    if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
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
          {canTeach.map((skill, index) => (
            <SkillTagUI
              key={`can-${index}`}
              bgColor="#EEE7F7" 
              text={skill}
            />
          ))}
        </div>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <div className={styles.skillsList}>
          {wantsToLearn.slice(0, 2).map((skill, index) => (
            <SkillTagUI
              key={`want-${index}`}
              bgColor="#E9F7E7" 
              text={skill}
            />
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
};

export default UserCard;
