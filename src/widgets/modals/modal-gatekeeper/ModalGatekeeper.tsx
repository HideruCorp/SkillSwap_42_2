import { useNavigate } from 'react-router-dom';
import Button from '@shared/ui/button/Button';
import styles from './modal-gatekeeper.module.scss';

interface ModalGatekeeperProps {
  onClose: () => void;
}

function ModalGatekeeper({ onClose }: ModalGatekeeperProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      <h2 className={styles.title}>Войдите, чтобы продолжить</h2>
      <p className={styles.text}>
        Чтобы предложить обмен навыками, необходимо войти или зарегистрироваться
      </p>
      <div className={styles.buttons}>
        <Button className={styles.button} type="secondary" onClick={onClose} title="Отмена" />
        <Button className={styles.button} type="primary" onClick={handleLogin} title="Войти" />
      </div>
    </div>
  );
}

export default ModalGatekeeper;
