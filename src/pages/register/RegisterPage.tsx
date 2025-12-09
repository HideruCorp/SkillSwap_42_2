import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import { useState, type PropsWithChildren } from 'react';
import { DatePickerUI } from '@shared/ui/date-picker';
import styles from './register-page.module.scss';

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
  return (
    <section className={styles.register}>
      <RegisterLayout
        leftPart={
          <GrayRectangle>
            <DatePickerUI value={testDate} onChange={setTestDate} maxDate={new Date()} />
          </GrayRectangle>
        }
        rightPart={
          // компонент вставляется в зависимости от Шага регистрации
          // Шаг 1
          <ComponentWithImg
            img={imgAndText[0].img}
            title={imgAndText[0].title}
            text={imgAndText[0].text}
          />

          // Шаг 2
          // <ComponentWithImg
          //   img={imgAndText[1].img}
          //   title={imgAndText[1].title}
          //   text={imgAndText[1].text}
          // />

          // Шаг 3
          // <ComponentWithImg
          //   img={imgAndText[2].img}
          //   title={imgAndText[2].title}
          //   text={imgAndText[2].text}
          // />
        }
      />
    </section>
  );
}

export default RegisterPage;
