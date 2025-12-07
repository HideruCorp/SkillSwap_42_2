export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'change' | 'password';
  
  error?: string;
  message?: string;
  disabled?: boolean;
}