import React from 'react';
import styles from './checkbox.module.scss';
import type { CheckboxProps } from './type';

export const CheckboxUI = ({
  variant,
  checked = false,
  isDisabled = false,
  text,
  onToggle,
}: CheckboxProps) => {
  const inputId = React.useId();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  const isRemoveIcon = variant === 'remove';
  const containerClass = `${styles.container} ${isRemoveIcon ? styles.removeStyle : ''}`;

  return (
    <label htmlFor={inputId} className={containerClass}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
      />
      <span className={styles.visualIndicator} />
      <span className={styles.textContent}>{text}</span>
    </label>
  );
};

export default CheckboxUI;
