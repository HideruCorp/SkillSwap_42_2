import styles from './server-error-page.module.scss';

/*
className={styles['server-error__some-bem--specific']}
*/

function ServerErrorPage() {
  return (
    <section className={styles['server-error']}>
      <h1>500</h1>
      <p>На сервере произошла ошибка</p>
    </section>
  );
}

export default ServerErrorPage;
