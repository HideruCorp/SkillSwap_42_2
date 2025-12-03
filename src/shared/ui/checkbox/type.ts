export interface CheckboxProps {
  variant: "default" | "remove";
  checked?: boolean;
  isDisabled?: boolean;
  text: string;
  onToggle?: (state: boolean) => void;
}