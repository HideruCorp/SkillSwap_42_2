import type { SkillTag } from '@shared/ui/skill-tag-list';

export interface UserSkillCardProps {
  name: string;
  city: string;
  age: number;
  canTeach: SkillTag[];
  wantsToLearn: SkillTag[];
  avatarUrl?: string | null;
  about: string;
}
