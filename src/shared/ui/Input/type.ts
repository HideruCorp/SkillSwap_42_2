export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'change' | 'password';
  error?: string;
  message?: string;
  disabled?: boolean;
}
