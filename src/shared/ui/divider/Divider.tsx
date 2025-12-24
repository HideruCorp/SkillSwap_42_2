import styles from './divider.module.scss'

export interface DividerProps {
  text?: string
  className?: string
}

export function Divider({ text = 'или', className = '' }: DividerProps) {
  return (
    <div className={`${styles.divider} ${className}`}>
      <span className={styles.line} />
      {text && <span className={styles.text}>{text}</span>}
      <span className={styles.line} />
    </div>
  )
}

export default Divider
