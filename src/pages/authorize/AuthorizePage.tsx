import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import Button from '@shared/ui/button/Button';
import ProgressBar from '@widgets/progress-bar/ProgressBar';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import SkillDataForm from '@widgets/forms/skill-data-form';
import SecondStepForm from '@widgets/forms/second-step-form/SecondStepForm';
import CredentialsForm, { type CredentialsFormData } from '@widgets/forms/credentials-form';
import { useRegistrationWizard, useStepCredentials, useLogin, prevStep } from '@features/auth';
import { useDispatch } from '../../services/store';
import styles from './authorize-page.module.scss';

const imgAndText = [
  {
    img: 'src/shared/assets/img/light-Bulb.svg',
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Войдите или зарегистрируйтесь, чтобы обмениваться знаниями и навыками',
  },
  {
    img: 'src/shared/assets/img/user-Info.svg',
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    img: 'src/shared/assets/img/school-Board.svg',
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
];

function AuthorizePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Хуки для работы с registration wizard
  const { currentStep, goToStep, submitRegistration } = useRegistrationWizard();
  const { updateCredentials, submitStep, checkEmail, isSubmitting } = useStepCredentials();
  const { loginUser, isLoading, loginError, clearLoginError } = useLogin();

  const handleCredentialsSubmit = async (data: CredentialsFormData) => {
    const { email, password } = data;
    clearLoginError();

    // Проверяем, существует ли email
    const isEmailAvailable = await checkEmail(email);

    if (!isEmailAvailable) {
      // Email существует — пытаемся войти
      const success = await loginUser(email, password);
      if (success) {
        navigate('/');
      }
    } else {
      // Email не существует — начинаем регистрацию
      updateCredentials({ email, password });
      await submitStep();
    }
  };

  // Рендер формы первого шага (credentials)
  const renderCredentialsForm = () => (
    <CredentialsForm
      onSubmit={handleCredentialsSubmit}
      isLoading={isLoading || isSubmitting}
      error={loginError}
    />
  );

  // Рендер формы второго шага (userData)
  const renderUserDataForm = () => <SecondStepForm />;

  // Обработчик успешного завершения третьего шага
  const handleSkillDataSubmitSuccess = useCallback(async () => {
    // TODO: #191 skill preview modal
    const result = await submitRegistration();
    if (result.success && result.skillId) {
      navigate(`/skill/${result.skillId}?registerSuccess=true`);
    }
  }, [submitRegistration, navigate]);

  // Рендер формы третьего шага (skillData)
  const renderSkillDataForm = () => (
    <SkillDataForm onSubmitSuccess={handleSkillDataSubmitSuccess} />
  );

  // Выбор контента в зависимости от шага
  const renderForm = () => {
    switch (currentStep) {
      case 2:
        return renderUserDataForm();
      case 3:
        return renderSkillDataForm();
      default:
        return renderCredentialsForm();
    }
  };

  return (
    <section className={styles.authorize}>
      <RegisterLayout
        header={<ProgressBar currentStep={currentStep} totalSteps={3} />}
        leftPart={renderForm()}
        rightPart={
          <ComponentWithImg
            img={imgAndText[currentStep - 1].img}
            title={imgAndText[currentStep - 1].title}
            text={imgAndText[currentStep - 1].text}
          />
        }
      />
    </section>
  );
}

export default AuthorizePage;
