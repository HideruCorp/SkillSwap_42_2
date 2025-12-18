import type { SkillTag } from '@shared/ui/skill-tag-list';

export interface UserCardProps {
  id: number; // ID пользователя (владельца карточки)
  mainSkillId: number; // ID основного навыка, по которому считаем лайки
  name: string;
  city: string;
  age: number;
  canTeach: SkillTag[];
  wantsToLearn: SkillTag[];
  avatarUrl?: string | null;
  onDetailsClick?: (userId: number) => void;
  onLikeClick?: (userId: number) => void;
  isLiked?: boolean;
  likes: number[];
}
