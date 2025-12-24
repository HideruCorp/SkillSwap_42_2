import LikeIcon from '@shared/assets/img/like-Default.svg?react'
import styles from './favorites.module.scss'

function Favorites() {
  return (
    <button type="button" className={`${styles.favorites}`}>
      <LikeIcon className={styles.favoritesIcon} aria-label="Избранное" />
    </button>
  )
}
export default Favorites
