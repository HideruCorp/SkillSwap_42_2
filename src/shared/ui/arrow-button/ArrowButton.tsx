import cn from 'classnames';
import ChevronRight from '@shared/assets/img/chevron-Right.svg?react';
import styles from './arrow-button.module.scss';

interface ArrowButtonProps {
  direction?: 'left' | 'right';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

function ArrowButton({
  direction = 'right',
  disabled = false,
  onClick,
  className,
  ariaLabel,
}: ArrowButtonProps) {
  const label = ariaLabel ?? (direction === 'left' ? 'Назад' : 'Вперёд');

  return (
    <button
      type="button"
      className={cn(
        styles.arrowButton,
        direction === 'left' && styles.left,
        direction === 'right' && styles.right,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-label={label}
    >
      <ChevronRight className={styles.icon} />
    </button>
  );
}

export default ArrowButton;
