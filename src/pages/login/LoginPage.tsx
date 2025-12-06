import styles from './login-page.module.scss';

/*
className={styles['login__some-bem--specific']}
*/

function LoginPage() {
  return (
    <section className={styles.login}>
      <h1>Вход</h1>
      <p>Страница входа в систему</p>
    </section>
  );
}

export default LoginPage;
