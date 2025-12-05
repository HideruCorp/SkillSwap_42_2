import Button from '@shared/ui/button/Button';
import Idea from '@shared/assets/img/idea.svg?react';
import type { NotificationItemProps } from './type';
import styles from './notification-item-ui.module.scss';

function NotificationItemUI({
  isNew,
  userName,
  action,
  createdDate,
  onClick,
}: NotificationItemProps) {
  const title = `${userName} ${action === 'accepts' ? 'принял ваш обмен' : 'предлагает вам обмен'}`;
  const description = `${action === 'accepts' ? 'Перейдите в профиль, чтобы обсудить детали' : 'Примите обмен, чтобы обсудить детали'}`;

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
        <div className={styles.date}>{createdDate}</div>
      </div>
      {isNew ? (
        <div className={styles.button}>
          <Button title="Перейти" type="primary" onClick={onClick || (() => {})} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default NotificationItemUI;
