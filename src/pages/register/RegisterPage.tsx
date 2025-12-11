import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import { useState, type PropsWithChildren } from 'react';
import { DatePickerUI } from '@shared/ui/date-picker';
import { AvatarPicker } from '@features/avatar-picker';
import styles from './register-page.module.scss';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';

/*
className={styles['register__some-bem--specific']}
*/

// заменить на форму регистрации и компонент с картинкой и текстом
function GrayRectangle({ children }: PropsWithChildren) {
  return (
    <div style={{ backgroundColor: 'gray', width: '556px', height: '400px', padding: '20px' }}>
      {children}
    </div>
  );
}

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
  const [testDate, setTestDate] = useState<Date | undefined>(new Date());
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    // TODO: Сохранить файл для отправки формы
  };

  return (
    <section className={styles.register}>
      <RegisterLayout
        header={<ProgressBar currentStep={currentStep} totalSteps={3} />}
        leftPart={
          <GrayRectangle>
            <AvatarPicker onAvatarChange={handleAvatarChange} size={72} />
            <DatePickerUI value={testDate} onChange={setTestDate} maxDate={new Date()} />
          </GrayRectangle>
        }
        rightPart={
          // компонент вставляется в зависимости от Шага регистрации
          // Шаг 1
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
