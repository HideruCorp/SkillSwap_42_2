export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'change' | 'password';
  
  error?: string;
  message?: string;
  disabled?: boolean;
  label?: string;
}