import Button from '@shared/ui/button/Button';
import styles from './modal-exchange.module.scss';

interface ModalExchangeProps {
  onClose: () => void;
}

function ModalExchange({ onClose }: ModalExchangeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      <h2 className={styles.title}>Вы предложили обмен</h2>
      <p className={styles.text}>Теперь дождитесь подтверждения. Вам придет уведомление</p>
      <Button className={styles.button} type="primary" onClick={onClose} title="Готово" />
    </div>
  );
}

export default ModalExchange;
