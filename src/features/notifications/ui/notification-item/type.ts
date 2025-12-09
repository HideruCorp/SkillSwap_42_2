import type { Notification } from '@entities/notification';

export interface NotificationItemProps extends Omit<Notification, 'id' | 'userId'> {
  onClick?: () => void;
}
