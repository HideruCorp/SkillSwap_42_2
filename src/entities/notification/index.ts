import fetchNotifications from './api/notificationsApi';
import notificationsReducer, {
  addNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsReadForUser,
  clearViewedForUser,
} from './model/notificationsSlice';

export type { Notification, NotificationsState } from './model/types';

export {
  fetchNotifications,
  notificationsReducer,
  addNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsReadForUser,
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
