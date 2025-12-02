import styles from './notification.module.scss';

function Notification() {
  return (
    <button type="button" className={`${styles.notification}`}>
      <img src="../../../src/shared/assets/img/notification-Default.svg" alt="нотификация" />
    </button>
  );
}
export default Notification;
