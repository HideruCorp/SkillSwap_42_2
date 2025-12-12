import type { ReactElement } from 'react';
import { ProgressBar } from '@widgets/progress-bar/ProgressBar';
import styles from './registerLayout.module.scss';

interface RegisterLayoutProps {
  leftPart: ReactElement;
  rightPart: ReactElement;
  currentStep: number;
  totalSteps: number;
}

function RegisterLayout({ leftPart, rightPart, currentStep, totalSteps }: RegisterLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <div className={styles.left}>{leftPart}</div>
      <div className={styles.right}>{rightPart}</div>
    </div>
  );
}

export default RegisterLayout;
