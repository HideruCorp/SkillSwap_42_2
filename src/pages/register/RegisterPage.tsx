import { useState } from 'react';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import Input from '@shared/ui/Input/InputUI';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import styles from './register-page.module.scss';

const imgAndText = [
  {
    img: 'light-Bulb.svg',
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  {
    img: 'user-Info.svg',
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    img: 'school-Board.svg',
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
];

function RegisterPage() {
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

    setFormError('');

    if (!email || !password) {
      setFormError('Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных');
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      setFormError('Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных');
      return;
    }

    // TODO: Отправить данные для авторизации
    console.log('Отправка данных авторизации', { email, password });
  };

  const handleGoogleAuth = () => {
    console.log('Авторизация через Google');
  };

  const handleAppleAuth = () => {
    console.log('Авторизация через Apple');
  };

  return (
    <section className={styles.register}>
      <RegisterLayout
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
          <div className={styles.rightPart}>
            {/* компонент вставляется в зависимости от Шага регистрации */}
            {/* Шаг 1 */}
            <ComponentWithImg
              img={imgAndText[0].img}
              title={imgAndText[0].title}
              text={imgAndText[0].text}
            />

            {/* Шаг 2 */}
            {/* <ComponentWithImg
              img={imgAndText[1].img}
              title={imgAndText[1].title}
              text={imgAndText[1].text}
            /> */}

            {/* Шаг 3 */}
            {/* <ComponentWithImg
              img={imgAndText[2].img}
              title={imgAndText[2].title}
              text={imgAndText[2].text}
            /> */}
          </div>
        }
        currentStep={1}
        totalSteps={3}
      />
    </section>
  );
}

export default RegisterPage;
