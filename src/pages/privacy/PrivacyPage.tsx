import styles from './privacy-page.module.scss';

/*
className={styles['privacy__some-bem--specific']}
*/

function PrivacyPage() {
  return (
    <section className={styles.privacy}>
      <h1>Политика конфиденциальности</h1>
      <p>Страница политики конфиденциальности</p>
    </section>
  );
}

export default PrivacyPage;
