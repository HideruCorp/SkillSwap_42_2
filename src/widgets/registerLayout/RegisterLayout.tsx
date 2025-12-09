import type { ReactElement } from 'react';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';
import styles from './RegisterLayout.module.scss';

interface RegisterLayoutProps {
  leftPart: ReactElement;
  rightPart: ReactElement;
  currentStep?: number;
  totalSteps?: number;
}

function RegisterLayout({
  leftPart,
  rightPart,
  currentStep = 2,
  totalSteps = 3,
}: RegisterLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.left}>{leftPart}</div>
        <div className={styles.right}>{rightPart}</div>
      </div>
    </div>
  );
}

export default RegisterLayout;
