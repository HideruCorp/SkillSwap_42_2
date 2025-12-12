import fetchNotifications from './api/notificationsApi';
import notificationsReducer, {
  markAsRead,
  markAllAsReadForUser,
  removeNotification,
  clearViewedForUser,
} from './model/notificationsSlice';

export type { Notification, NotificationsState } from './model/types';

export {
  fetchNotifications,
  notificationsReducer,
  markAsRead,
  markAllAsReadForUser,
  removeNotification,
  clearViewedForUser,
};

export {
  selectNotificationsState,
  selectAllNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectNotificationById,
  selectNotificationsByUserId,
} from './model/selectors';

export default notificationsReducer;
