import React from 'react';
import CheckboxDefaultIcon from '@shared/assets/img/checkbox-Default.svg?react';
import CheckboxDoneIcon from '@shared/assets/img/checkbox-Done-Active.svg?react';
import CheckboxRemoveIcon from '@shared/assets/img/checkbox-Remove-Active.svg?react';
import styles from './checkbox.module.scss';
import type { CheckboxProps } from './type';

export function CheckboxUI({
  variant,
  checked = false,
  isDisabled = false,
  text,
  onToggle,
}: CheckboxProps) {
  const inputId = React.useId();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  const isRemoveIcon = variant === 'remove';

  return (
    <label htmlFor={inputId} className={styles.container}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
      />
      <span className={styles.visualIndicator}>
        {!checked && <CheckboxDefaultIcon />}
        {checked && !isRemoveIcon && <CheckboxDoneIcon />}
        {checked && isRemoveIcon && <CheckboxRemoveIcon />}
      </span>
      <span className={styles.textContent}>{text}</span>
    </label>
  );
}

export default CheckboxUI;
