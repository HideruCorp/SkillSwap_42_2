import { useState } from 'react';
import Header from '@widgets/header/Header';
import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import { ThirdStepForm } from '@widgets/forms/third-step-form';
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg';
import styles from './register-step3-page.module.scss';

function RegisterStep3Page() {
  const [currentStep, setCurrentStep] = useState(3);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <RegisterLayout
              currentStep={currentStep}
              totalSteps={3}
              leftPart={
                <div className={styles.formContainer}>
                  <ThirdStepForm setCurrentStep={setCurrentStep} />
                </div>
              }
              rightPart={
                <ComponentWithImg
                  img="school-Board.svg"
                  title="Укажите, чем вы готовы поделиться"
                  text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
                />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterStep3Page;
