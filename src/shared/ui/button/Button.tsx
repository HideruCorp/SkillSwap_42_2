import './button.scss';

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
      className={`button ${type === 'default' ? 'button-default' : 'button-primary'}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="button-text">{title}</span>
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
};

export default Button;
