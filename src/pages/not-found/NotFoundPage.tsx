import styles from './not-found-page.module.scss';

/*
className={styles['not-found__some-bem--specific']}
*/

function NotFoundPage() {
  return (
    <section className={styles['not-found']}>
      <h1>404</h1>
      <p>К сожалению, эта страница недоступна</p>
    </section>
  );
}

export default NotFoundPage;
