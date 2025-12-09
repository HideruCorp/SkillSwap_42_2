import ErrorPageContent from '@widgets/ErrorPageContent/ErrorPageContent';
import imageError500 from '@shared/assets/img/error 404.svg';
import styles from './not-found-page.module.scss';

function ServerErrorPage() {
  return (
    <div className={styles.container}>
      <ErrorPageContent
        image={imageError500}
        title="На сервере произошла ошибка"
        description="Попробуйте позже или вернитесь на главную страницу"
      />
    </div>
  );
}

export default ServerErrorPage;
