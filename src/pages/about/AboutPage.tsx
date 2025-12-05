import styles from './about-page.module.scss';

/*
className={styles['about__some-bem--specific']}
*/

function AboutPage() {
  return (
    <section className={styles.about}>
      <h1>О проекте</h1>
      <p>Страница с информацией о проекте SkillSwap</p>
    </section>
  );
}

export default AboutPage;
