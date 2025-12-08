export interface CheckboxProps {
  variant: 'remove' | 'default';
  checked?: boolean;
  isDisabled?: boolean;
  text: string;
  onToggle?: (state: boolean) => void;
}
