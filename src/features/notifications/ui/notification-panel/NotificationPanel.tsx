import NotificationItemUI from '@features/notifications/ui/notification-item/NotificationItemUI';
import { useNotificationPanel } from '../../hooks';
import type { NotificationPanelProps } from '../../types';
import styles from './notification-panel.module.scss';

function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const { newNotifications, viewedNotifications, readAll, clearViewed, onNotificationClick } =
    useNotificationPanel(userId, onClose);

  return (
    <div className={styles.panel}>
      {/* New Notifications Section */}
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>Новые уведомления</h2>
          {newNotifications.length > 0 && (
            <button type="button" className={styles['action-button']} onClick={readAll}>
              Прочитать все
            </button>
          )}
        </div>
        <div className={styles.notifications}>
          {newNotifications.length > 0 ? (
            newNotifications.map((notification) => (
              <NotificationItemUI
                key={notification.id}
                readed={notification.readed}
                userName={notification.userName}
                action={notification.action}
                createdDate={notification.createdDate}
                onClick={() => onNotificationClick(notification.id)}
              />
            ))
          ) : (
            <p className={styles.empty}>Нет новых уведомлений</p>
          )}
        </div>
      </section>

      {/* Viewed Notifications Section */}
      {viewedNotifications.length > 0 && (
        <section className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>Просмотренные</h2>
            <button type="button" className={styles['action-button']} onClick={clearViewed}>
              Очистить
            </button>
          </div>
          <div className={styles.notifications}>
            {viewedNotifications.map((notification) => (
              <NotificationItemUI
                key={notification.id}
                readed={notification.readed}
                userName={notification.userName}
                action={notification.action}
                createdDate={notification.createdDate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default NotificationPanel;
