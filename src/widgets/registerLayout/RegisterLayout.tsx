import type { ReactElement } from 'react';
import styles from './registerLayout.module.scss';

interface RegisterLayoutProps {
  leftPart: ReactElement;
  rightPart: ReactElement;
}

function RegisterLayout({ leftPart, rightPart }: RegisterLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Здесь будет Прогресс Бар</div>
      <div className={styles.left}>{leftPart}</div>
      <div className={styles.right}>{rightPart}</div>
    </div>
  );
}

export default RegisterLayout;
