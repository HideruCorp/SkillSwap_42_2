import { SkillTagListUI } from '@shared/ui/skill-tag-list';
import { getAgeSuffix } from '@shared/lib/utils';
import styles from './user-skill-card.module.scss';
import type { UserSkillCardProps } from './types';

function UserSkillCard({
  name,
  city,
  age,
  about,
  canTeach,
  wantsToLearn,
  avatarUrl,
}: UserSkillCardProps) {
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
      </div>

      {about && (
        <div className={styles.aboutSection}>
          <p className={styles.aboutText}>{about}</p>
        </div>
      )}

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <SkillTagListUI tags={canTeach} />
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <SkillTagListUI tags={wantsToLearn} />
      </div>
    </div>
  );
}

export default UserSkillCard;
