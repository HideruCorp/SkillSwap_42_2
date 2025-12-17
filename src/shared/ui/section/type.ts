import type { UserCardProps } from '@shared/ui/user-card/types';

export type SectionUIProps = {
  title: string;
  cards: UserCardProps[];
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  onLikeClick?: (id: number) => void;
  onDetailsClick?: (id: number) => void;
  triggerRef?: (node: HTMLDivElement | null) => void;
  hasMore?: boolean;
  headerExtra?: React.ReactNode; // дополнительный элемент в заголовке
  isFavorite?: (skillId: number) => boolean;
};
