import AppleIcon from '@shared/assets/img/apple.svg?react'
import GoogleIcon from '@shared/assets/img/google.svg?react'
import React from 'react'
import styles from './social-button.module.scss'

export type SocialProvider = 'google' | 'apple'

export interface SocialButtonProps {
  provider: SocialProvider
  onClick?: () => void
  className?: string
}

const providerConfig = {
  google: {
    icon: GoogleIcon,
    text: 'Продолжить с Google',
  },
  apple: {
    icon: AppleIcon,
    text: 'Продолжить с Apple',
  },
}

export function SocialButton({ provider, onClick, className = '' }: SocialButtonProps) {
  const config = providerConfig[provider]
  const Icon = config.icon

  const handleClick = () => {
    // Заглушка для авторизации через социальные сети

    // eslint-disable-next-line no-console
    console.log(`Авторизация через ${provider}`)
    if (onClick) {
      onClick()
    }
  }

  return (
    <button type="button" className={`${styles.socialButton} ${className}`} onClick={handleClick}>
      <Icon className={styles.icon} />
      <span className={styles.text}>{config.text}</span>
    </button>
  )
}

export default SocialButton
