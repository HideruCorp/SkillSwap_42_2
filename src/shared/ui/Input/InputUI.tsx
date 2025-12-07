import styles from './InputUI.module.scss';
import React, { useState } from 'react';
import type { InputProps } from './type';
import eyeIcon from '../../assets/img/visible.svg';
import editIcon from '../../assets/img/edit.svg';

function Input({ value, onChange, error, type, message, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={inputType}
        {...props}
      />
      
        {type === 'password' && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <div className={`${styles.eyeIconWrapper} ${showPassword ? styles.eyeIconSlash : ''}`}>
              <img 
                src={eyeIcon} 
                alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              />
            </div>
          </button>
        )}
        {type === 'change' && (
          <div className={styles.editIcon}>
            <img src={editIcon} />
          </div>
        )}
      </div>
      
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : message ? (
        <span className={styles.messageText}>{message}</span>
      ) : null}
    </div>
  );
}

export default Input;