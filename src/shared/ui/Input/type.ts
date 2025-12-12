export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'change' | 'password' | 'email';
  error?: string;
  message?: string;
  label?: string;
  disabled?: boolean;
}

