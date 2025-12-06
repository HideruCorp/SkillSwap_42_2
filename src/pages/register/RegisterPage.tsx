import styles from './register-page.module.scss';

/*
className={styles['register__some-bem--specific']}
*/

function RegisterPage() {
  return (
    <section className={styles.register}>
      <h1>Регистрация</h1>
      <p>Страница регистрации нового пользователя</p>
    </section>
  );
}

export default RegisterPage;
