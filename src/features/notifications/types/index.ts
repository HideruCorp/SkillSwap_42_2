import type { Notification } from '@entities/notification';

export interface NotificationPanelProps {
  userId: number;
  onClose?: () => void;
}

export interface NotificationIconProps {
  hasUnread?: boolean;
}

export interface UseNotificationsReturn {
  newNotifications: Notification[];
  viewedNotifications: Notification[];
  hasUnread: boolean;
  loading: boolean;
  readAll: () => void;
  clearViewed: () => void;
  markAsRead: (id: number) => void;
}

export interface UseNotificationPanelReturn {
  isOpen: boolean;
  newNotifications: Notification[];
  viewedNotifications: Notification[];
  hasUnread: boolean;
  toggle: (isOpen: boolean) => void;
  readAll: () => void;
  clearViewed: () => void;
  onNotificationClick: (id: number) => void;
}
