import type { SkillTag } from '@shared/ui/skill-tag-list';

export interface UserCardProps {
  name: string;
  city: string;
  age: number;
  canTeach: SkillTag[];
  wantsToLearn: SkillTag[];
  avatarUrl?: string | null;
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}
