import type { NotificationItemProps } from './type'
import Idea from '@shared/assets/img/idea.svg?react'
import { formatRelativeDate } from '@shared/lib/date'
import Button from '@shared/ui/button/Button'
import styles from './notification-item-ui.module.scss'

function doNothing() {}

function NotificationItemUI({
  readed,
  userName,
  action,
  createdDate,
  onClick,
}: NotificationItemProps) {
  const title = `${userName} ${action === 'accept' ? 'принял ваш обмен' : 'предлагает вам обмен'}`
  const description = `${action === 'accept' ? 'Перейдите в профиль, чтобы обсудить детали' : 'Примите обмен, чтобы обсудить детали'}`
  const formattedDate = formatRelativeDate(new Date(createdDate))

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.message}>
          <Idea name="idea" width={40} height={40} aria-hidden="true" />
          <div>
            <span className={styles.title}>{title}</span>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <div className={styles.date}>{formattedDate}</div>
      </div>
      {!readed
        ? (
            <Button
              className={styles.button}
              title="Перейти"
              variant="primary"
              onClick={onClick || doNothing}
            />
          )
        : (
            ''
          )}
    </div>
  )
}

export default NotificationItemUI
