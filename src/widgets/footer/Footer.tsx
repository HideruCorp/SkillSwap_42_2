import Logo from '@shared/ui/logo/Logo'
import { Link } from 'react-router-dom'
import styles from './footer.module.scss'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.logoSection}>
            <Logo />
          </div>
          <span className={styles.copyright}>
            Skillswap –
            {currentYear}
          </span>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.column}>
            <Link to="/about" className={styles.link}>
              • О проекте
            </Link>
            <a href="#allskills" className={styles.link}>
              • Все навыки
            </a>
          </div>

          <div className={styles.column}>
            <a href="#contacts" className={styles.link}>
              Контакты
            </a>
            <a href="#blog" className={styles.link}>
              Блог
            </a>
          </div>

          <div className={styles.column}>
            <Link to="/privacy" className={styles.link}>
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className={styles.link}>
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
