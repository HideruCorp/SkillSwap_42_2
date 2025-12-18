import Button from '@shared/ui/button/Button';
import styles from './StatusModal.module.scss';

interface StatusModalProps {
  onClose: () => void;
  icon: string;
  title: string;
  text: string;
  buttonText: string;
}

function StatusModal({ onClose, icon, title, text, buttonText }: StatusModalProps) {
  return (
    <div className={styles.container}>
      <img alt={title} className={styles.icon} src={icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      <Button className={styles.button} type="primary" onClick={onClose} title={buttonText} />
    </div>
  );
}

export default StatusModal;
