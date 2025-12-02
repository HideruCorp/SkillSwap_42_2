import styles from "./checkbox.module.scss";
import React from 'react';

interface CheckboxProps {
  variant: "default" | "remove";
  checked?: boolean;
  isDisabled?: boolean;
  text: string;
  onToggle?: (state: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  variant,
  checked = false,
  isDisabled = false,
  text,
  onToggle,
}: CheckboxProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  const isRemoveIcon = variant === "remove";
  const containerClass = `${styles.container} ${isRemoveIcon ? styles.removeStyle : ""}`;

  return (
    <label className={containerClass}>
      <input
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
      />
      <span className={styles.visualIndicator} />
      <span className={styles.textContent}>{text}</span>
    </label>
  );
}