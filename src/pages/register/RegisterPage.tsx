import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import styles from './register-page.module.scss';

/*
className={styles['register__some-bem--specific']}
*/

// заменить на форму регистрации и компонент с картинкой и текстом
function GrayRectangle() {
  return <div style={{ backgroundColor: 'gray', width: '556px', height: '400px' }} />;
}

function RegisterPage() {
  return (
    <section className={styles.register}>
      <RegisterLayout leftPart={<GrayRectangle />} rightPart={<GrayRectangle />} />
    </section>
  );
}

export default RegisterPage;
