import type { ReactElement } from 'react';
import styles from './registerLayout.module.scss';

interface RegisterLayoutProps {
  leftPart: ReactElement;
  rightPart: ReactElement;
  header: ReactElement;
}

function RegisterLayout({ leftPart, rightPart, header }: RegisterLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{header}</div>
      <div className={styles.contentWrapper}>
        <div className={styles.left}>{leftPart}</div>
        <div className={styles.right}>{rightPart}</div>
      </div>
    </div>
  );
}

export default RegisterLayout;
