import fetchNotifications from './api/notificationsApi'
import notificationsReducer, {
  addNotification,
  clearViewedForUser,
  deleteNotification,
  initializeNotifications,
  markAllAsReadForUser,
  markAsRead,
  updateNotification,
} from './model/notificationsSlice'

export {
  selectAllNotifications,
  selectNotificationById,
  selectNotificationsByRequestId,
  selectNotificationsByUserId,
  selectNotificationsError,
  selectNotificationsLoading,
  selectNotificationsState,
} from './model/selectors'

export {
  addNotification,
  clearViewedForUser,
  deleteNotification,
  fetchNotifications,
  initializeNotifications,
  markAllAsReadForUser,
  markAsRead,
  notificationsReducer,
  updateNotification,
}

export type { Notification, NotificationsState } from './model/types'

export default notificationsReducer
