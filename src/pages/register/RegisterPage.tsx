import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
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
        rightPart={<GrayRectangle />}
      />
    </section>
  );
}

export default RegisterPage;
