import styles from './terms-page.module.scss';

/*
className={styles['terms__some-bem--specific']}
*/

function TermsPage() {
  return (
    <section className={styles.terms}>
      <h1>Пользовательское соглашение</h1>
      <p>Страница пользовательского соглашения</p>
    </section>
  );
}

export default TermsPage;
