import React from 'react';
import styles from './RadioGroupUI.module.scss';
import type { RadioGroupProps } from './type';

export const RadioGroupUI: React.FC<RadioGroupProps> = ({ options, onChange, name, value }) => {
  return (
    <div className={styles.radio} role="radiogroup">
      {options.map((option) => (
        <label key={option.value} className={styles.label}>
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={styles.hiddenInput}
          />
          <div className={styles.circle} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
