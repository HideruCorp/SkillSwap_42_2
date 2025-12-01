import styles from './button.module.scss';

export type ButtonType = 'default' | 'primary';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type: ButtonType;
  disabled?: boolean;
}

function Button({ title, onClick, type = 'default', disabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${type === 'default' ? styles.buttonDefault : styles.buttonPrimary}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`${styles.buttonText}`}>{title}</span>
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
};

export default Button;
