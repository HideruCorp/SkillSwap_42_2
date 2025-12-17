import fetchNotifications from './api/notificationsApi';
import notificationsReducer, {
  addNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsReadForUser,
  clearViewedForUser,
  initializeNotifications,
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
  initializeNotifications,
};

export {
  selectNotificationsState,
  selectAllNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectNotificationById,
  selectNotificationsByUserId,
  selectNotificationsByRequestId,
} from './model/selectors';

export default notificationsReducer;
