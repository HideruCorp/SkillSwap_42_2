import type { UserCardProps } from '@shared/ui/user-card/types';

export type SectionUIProps = {
  title: string;
  cards: UserCardProps[];
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  onLikeClick?: (userId: number) => void;
  onDetailsClick?: (userId: number) => void;
  triggerRef?: (node: HTMLDivElement | null) => void;
  hasMore?: boolean;
  headerExtra?: React.ReactNode;
  isFavorite?: (userId: number) => boolean;
};