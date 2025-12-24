import type { RadioGroupProps } from './type'
import RadioButtonActiveIcon from '@shared/assets/img/radiobutton-Active.svg?react'
import RadioButtonDefaultIcon from '@shared/assets/img/radiobutton-Default.svg?react'
import React from 'react'
import styles from './RadioGroupUI.module.scss'

export function RadioGroupUI({ options, onChange, name, value }: RadioGroupProps) {
  const idPrefix = React.useId()

  return (
    <div className={styles.radio} role="radiogroup">
      {options.map((option) => {
        const inputId = `${idPrefix}-${option.value}`
        return (
          <label key={option.value} htmlFor={inputId} className={styles.label}>
            <input
              id={inputId}
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.hiddenInput}
            />
            <span className={styles.visualIndicator}>
              {value === option.value ? <RadioButtonActiveIcon /> : <RadioButtonDefaultIcon />}
            </span>
            <span>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default RadioGroupUI
