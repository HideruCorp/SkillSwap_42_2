import { useNavigate } from 'react-router-dom';
import Button from '@shared/ui/button/Button';
import type { ErrorPageContentProps } from './type';
import styles from './ErrorPageContent.module.scss';

export default function ErrorPageContent({ image, title, description }: ErrorPageContentProps) {
  const navigate = useNavigate();
  const handleRedirectHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <img className={styles.image} src={image} alt={title} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{description}</p>
      <div className={styles.buttons}>
        <Button
          className={styles.fullWidthButton}
          title="Сообщить об ошибке"
          type="secondary"
          onClick={() => alert('Отчёт об ошибке отправлен')}
        />
        <Button
          className={styles.fullWidthButton}
          title="На главную"
          type="primary"
          onClick={handleRedirectHome}
        />
      </div>
    </div>
  );
}
