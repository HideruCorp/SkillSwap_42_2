import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import styles from './login-page.module.scss';

/*
className={styles['login__some-bem--specific']}
*/

// заменить на форму логин и компонент с картинкой и текстом
function GrayRectangle() {
  return <div style={{ backgroundColor: 'gray', width: '556px', height: '400px' }} />;
}

function LoginPage() {
  return (
    <section className={styles.login}>
      <RegisterLayout leftPart={<GrayRectangle />} rightPart={<GrayRectangle />} />
    </section>
  );
}

export default LoginPage;
