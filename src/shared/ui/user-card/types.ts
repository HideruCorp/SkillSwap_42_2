import type { SkillTag } from '@shared/ui/skill-tag-list';

export interface UserCardProps {
  id: number; // добавлен id
  name: string;
  city: string;
  age: number;
  canTeach: SkillTag[];
  wantsToLearn: SkillTag[];
  avatarUrl?: string | null;
  onDetailsClick?: (id: number) => void; // принимает id
  onLikeClick?: (id: number) => void; // принимает id
  isLiked?: boolean;
}
