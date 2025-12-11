import { useState } from 'react';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import Input from '@shared/ui/Input/InputUI';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import styles from './login-page.module.scss';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 8;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (formError) {
      setFormError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Очищаем предыдущую ошибку
    setFormError('');

    // Базовая валидация наличия полей
    if (!email || !password) {
      setFormError(
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'
      );
      return;
    }

    // Валидация формата email и длины пароля
    if (!validateEmail(email) || !validatePassword(password)) {
      setFormError(
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'
      );
      return;
    }

    // Здесь будет проверка на сервере (заглушка)
    // TODO: Отправка данных на сервер для проверки
    console.log('Форма валидна, отправка данных на сервер');

    // Заглушка: если данные неверны, показываем ошибку
    // В реальном приложении это будет ответ от сервера
    // setFormError('Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных');
  };

  const handleGoogleAuth = () => {
    console.log('Авторизация через Google');
  };

  const handleAppleAuth = () => {
    console.log('Авторизация через Apple');
  };

  return (
    <section className={styles.login}>
      <RegisterLayout
        header={<h2 className={styles.header}>Вход</h2>}
        leftPart={
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.socialButtons}>
              <SocialButton provider="google" onClick={handleGoogleAuth} />
              <SocialButton provider="apple" onClick={handleAppleAuth} />
            </div>

            <Divider />

            <div className={styles.inputs}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Введите email"
              />

              <Input
                label="Пароль"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Придумайте надёжный пароль"
                message="Пароль должен содержать не менее 8 знаков"
              />
            </div>

            {formError && <div className={styles.formError}>{formError}</div>}

            <div className={styles.submitButton}>
              <Button type="primary" title="Далее" onClick={() => handleSubmit()} />
            </div>
          </form>
        }
        rightPart={
          <ComponentWithImg
            img="light-Bulb.svg"
            title="С возвращением в SkillSwap!"
            text="Обменивайтесь знаниями и навыками с другими людьми"
          />
        }
      />
    </section>
  );
}

export default LoginPage;
