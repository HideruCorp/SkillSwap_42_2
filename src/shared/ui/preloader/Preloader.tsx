import styles from './preloader.module.scss'

function Preloader() {
  return (
    <div className={styles.preloader}>
      <div className={styles.preloader_circle} />
    </div>
  )
}

export default Preloader
