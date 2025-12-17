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
  onDetailsClick?: (id: number) => void; // принимает id пользователя
  onLikeClick?: (skillId: number) => void; // принимает id навыка
  isLiked?: boolean;
  likes: number[];
}
