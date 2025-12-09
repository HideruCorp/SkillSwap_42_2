import React from 'react';
import cn from 'classnames';
import styles from './button.module.scss';

export type ButtonType = 'primary' | 'default' | 'secondary' | 'tertiary';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: ButtonType;
  disabled?: boolean;
  className?: string;

  // Иконка справа от текста: <ChevronRight /> Например
  iconRight?: React.ReactNode;
}

function Button({
  title,
  onClick,
  type = 'default',
  disabled = false,
  className,
  iconRight = null,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(styles.button, className, {
        [styles.buttonPrimary]: type === 'primary',
        [styles.buttonDefault]: type === 'default',
        [styles.buttonSecondary]: type === 'secondary',
        [styles.buttonTertiary]: type === 'tertiary',
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>{title}</span>

      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
}

export default Button;
