import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import { useState, type PropsWithChildren } from 'react';
import styles from './register-page.module.scss';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';
import ThirdStepForm from '@widgets/forms/third-step-form';

/*
className={styles['register__some-bem--specific']}
*/

const imgAndText = [
  {
    img: 'src/shared/assets/img/light-Bulb.svg',
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  {
    img: '../src/shared/assets/img/user-Info.svg',
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    img: '../src/shared/assets/img/school-Board.svg',
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
];

interface RegisterPageProps {
  step: number;
}

function RegisterPage({ step }: RegisterPageProps) {
  const [testDate, setTestDate] = useState<Date | undefined>(new Date());
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(step);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    // TODO: Сохранить файл для отправки формы
  };

  return (
    <section className={styles.register}>
      <RegisterLayout
        header={<ProgressBar currentStep={currentStep} totalSteps={3} />}
        leftPart={
          step === 1 ? (
            <div>Сюда вставить форму Регистрация 1 Шаг</div>
          ) : step === 2 ? (
            <div>Сюда вставить форму второго шага</div>
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
      />
    </section>
  );
}

export default RegisterPage;
