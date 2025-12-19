import { memo } from 'react';
import { SkillTagListUI } from '@shared/ui/skill-tag-list';
import { SkillTagUI } from '@shared/ui/skill-tag';
import Button from '@shared/ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { getAgeSuffix } from '@shared/lib/date';
import styles from './skill-card.module.scss';
import type { SkillCardProps } from './types';

const SkillCard = memo(function SkillCard({
  id,
  name,
  city,
  age,
  canTeach,
  wantsToLearn,
  avatarUrl,
  actionSlot,
}: SkillCardProps) {
  const navigate = useNavigate();

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

        {actionSlot}
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <SkillTagUI bgColor={canTeach.bgColor} text={canTeach.text} />
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <SkillTagListUI tags={wantsToLearn} />
      </div>

      <div className={styles.footer}>
        <Button
          className={styles.detailsButton}
          title="Подробнее"
          onClick={() => navigate(`/skill/${id}`)}
          type="default"
        />
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

export default SkillCard;
