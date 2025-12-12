import type { SkillType } from '@shared/types';
import { SkillDescriptionUI } from '@shared/ui/skill-description';
import Button from '@shared/ui/button/Button';
import LikeDefaultIcon from '@shared/assets/img/like-Default.svg?react';
import LikeActiveIcon from '@shared/assets/img/like-Active.svg?react';
import ShareIcon from '@shared/assets/img/share.svg?react';
import styles from './skill.module.scss';
import { SkillGallery } from '../skillGallery';

export interface SkillProps {
  skill: SkillType;
  skillDescription: {
    skillName: string;
    category: string;
    subcategory: string;
    description: string;
  };
  isLiked: boolean;
  onLike: (skillId: number) => void;
  onShare: (skillId: number) => void;
  onMoreDetails: (skillId: number) => void;
}

function Skill({ skill, skillDescription, isLiked, onLike, onShare, onMoreDetails }: SkillProps) {
  return (
    <div className={styles.skillCard}>
      <div className={styles.buttonBlock}>
        <button
          type="button"
          className={styles.likeButton}
          onClick={() => onLike(skill.id)}
          aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          {isLiked ? (
            <LikeActiveIcon className={styles.likeIcon} />
          ) : (
            <LikeDefaultIcon className={styles.likeIcon} />
          )}
        </button>

        <button
          type="button"
          className={styles.shareButton}
          onClick={() => onShare(skill.id)}
          aria-label="Поделиться навыком"
        >
          <ShareIcon className={styles.shareIcon} />
        </button>
      </div>
      <div className={styles.skillInfoBlock}>
        <div className={styles.descriptionBlock}>
          <div className={styles.descriptionWrapper}>
            <SkillDescriptionUI
              skillName={skillDescription.skillName}
              category={skillDescription.category}
              subcategory={skillDescription.subcategory}
              description={skillDescription.description}
            />
          </div>
          <Button title="Подробнее" onClick={() => onMoreDetails(skill.id)} type="default" />
        </div>
        <SkillGallery images={skill.images} title={skill.title} />
      </div>
    </div>
  );
}
export default Skill;
