import styles from './button.module.scss';

export type ButtonType = 'default' | 'primary';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type: ButtonType;
  disabled?: boolean;
  className?: string;
}

function Button({ title, onClick, type = 'default', disabled = false, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className} ${type === 'default' ? styles.buttonDefault : styles.buttonPrimary}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`${styles.buttonText}`}>{title}</span>
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
  className: undefined,
};

export default Button;
