import type { InputProps } from './type'
import { useState } from 'react'
import EditIcon from '../../assets/img/edit.svg?react'
import EyeIcon from '../../assets/img/visible.svg?react'
import styles from './InputUI.module.scss'

function Input({
  value,
  onChange,
  error,
  type,
  name,
  message,
  label,
  disabled,
  placeholder,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${error ? styles.error : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />

        {type === 'password' && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <div className={`${styles.eyeIconWrapper} ${showPassword ? styles.eyeIconSlash : ''}`}>
              <EyeIcon title={showPassword ? 'Скрыть пароль' : 'Показать пароль'} />
            </div>
          </button>
        )}
        {type === 'change' && (
          <div className={styles.editIcon}>
            <EditIcon />
          </div>
        )}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
      {!error && message && <span className={styles.messageText}>{message}</span>}
    </div>
  )
}

export default Input
