import { useState } from 'react';
import { useSelector } from 'react-redux';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import Input from '@shared/ui/Input/InputUI';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';
import { selectCurrentStep } from '@features/auth/model';
import useStepCredentials from '@features/auth/hooks/useStepCredentials';
import styles from './register-page.module.scss';
import lightBulbImg from '@shared/assets/img/light-Bulb.svg';
import userInfoImg from '@shared/assets/img/user-Info.svg';
import schoolBoardImg from '@shared/assets/img/school-Board.svg';
import SkillDataForm from '@widgets/forms/skill-data-form';
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
  const currentStep = useSelector(selectCurrentStep);
  const { updateCredentials, submitStep, errors, isSubmitting } = useStepCredentials();
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
    updateCredentials({ email: value });
    if (formError) {
      setFormError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    updateCredentials({ password: value });
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
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

    updateCredentials({ email, password });
    const success = await submitStep();
    if (!success && errors) {
      const errorMessage = errors.email || errors.password || 'Ошибка валидации';
      setFormError(errorMessage);
    }
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

            {(formError || errors?.email || errors?.password) && (
              <div className={styles.formError}>
                {formError || errors?.email || errors?.password}
              </div>
            )}

            <div className={styles.submitButton}>
              <Button
                type="primary"
                title={isSubmitting ? 'Обработка...' : 'Далее'}
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
              />
            </div>
          </form>
          ) : currentStep === 2 ? (
            <SecondStepForm />
          ) : (
            <SkillDataForm onSubmitSuccess={() => {}} />
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