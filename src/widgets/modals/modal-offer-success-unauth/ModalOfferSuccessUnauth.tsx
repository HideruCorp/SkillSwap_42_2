import Button from '@shared/ui/button/Button';
import styles from './modal-offer-success-unauth.module.scss';

interface ModalOfferSuccessUnauthProps {
  onClose: () => void;
}

function ModalOfferSuccessUnauth({ onClose }: ModalOfferSuccessUnauthProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      <h2 className={styles.title}>Ваше предложение создано</h2>
      <p className={styles.text}>Теперь вы можете предложить обмен</p>
      <Button className={styles.button} type="primary" onClick={onClose} title="Готово" />
    </div>
  );
}

export default ModalOfferSuccessUnauth;
