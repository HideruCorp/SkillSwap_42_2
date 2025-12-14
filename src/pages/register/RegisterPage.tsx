import { useState } from 'react';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import Input from '@shared/ui/Input/InputUI';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';
import styles from './register-page.module.scss';
import lightBulbImg from '@shared/assets/img/light-Bulb.svg';
import userInfoImg from '@shared/assets/img/user-Info.svg';
import schoolBoardImg from '@shared/assets/img/school-Board.svg';
import ThirdStepForm from '@widgets/forms/third-step-form';
import SecondStepForm from '@widgets/forms/second-step-form/SecondStepForm';

const imgAndText = [
  {
    img: lightBulbImg,
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  {
    img: userInfoImg,
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    img: schoolBoardImg,
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
];

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
          currentStep === 1 ? (
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
          ) : currentStep === 2 ? (
            <div>
              <SecondStepForm
                onSubmit={(data) => {
                  console.log('Данные второго шага:', data);
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep(1)}
                initialData={{}}
              />
            </div>
          ) : (
            <ThirdStepForm setCurrentStep={setCurrentStep} />
          )
        }
        rightPart={
          <ComponentWithImg
            img={imgAndText[currentStep - 1].img}
            title={imgAndText[currentStep - 1].title}
            text={imgAndText[currentStep - 1].text}
          />
        }
        currentStep={currentStep}
        totalSteps={3}
      />
    </section>
  );
}

export default RegisterPage;