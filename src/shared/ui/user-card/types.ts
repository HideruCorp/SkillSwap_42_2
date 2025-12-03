export interface UserCardProps {
  name: string;
  city: string;
  age: number;
  canTeach: string[];
  wantsToLearn: string[];
  avatarUrl?: string;
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}
