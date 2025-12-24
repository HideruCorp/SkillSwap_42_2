import NotificationDefault from '@shared/assets/img/notification-Default.svg?react'
import NotificationNew from '@shared/assets/img/notification-New.svg?react'

import styles from './notification-icon.module.scss'

interface NotificationProps {
  hasUnread?: boolean
}

function NotificationIcon({ hasUnread = false }: NotificationProps) {
  return (
    <div className={styles.notification}>
      {hasUnread
        ? (
            <NotificationNew aria-label="Уведомления" />
          )
        : (
            <NotificationDefault aria-label="Уведомления" />
          )}
    </div>
  )
}

export default NotificationIcon
