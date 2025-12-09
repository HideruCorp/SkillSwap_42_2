import RegisterLayout from '@widgets/registerLayout/RegisterLayout';
import { type PropsWithChildren } from 'react';
import styles from './register-step2-page.module.scss';

function GrayRectangle({ children }: PropsWithChildren) {
  return (
    <div style={{ backgroundColor: 'gray', width: '556px', height: '400px', padding: '20px' }}>
      {children}
    </div>
  );
}

interface ImageWithTextProps {
  title: string;
  description: string;
}

function ImageWithText({ title, description }: ImageWithTextProps) {
  return (
    <div className={styles.imageTextContainer}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

function RegisterPageStep2() {
  const imageTextContent = {
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <RegisterLayout
              currentStep={2}
              totalSteps={3}
              leftPart={<GrayRectangle />}
              rightPart={
                <ImageWithText
                  title={imageTextContent.title}
                  description={imageTextContent.description}
                />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPageStep2;
