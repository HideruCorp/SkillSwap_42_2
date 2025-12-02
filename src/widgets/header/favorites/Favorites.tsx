import styles from './favorites.module.scss';

function Favorites() {
  return (
    <button type="button" className={`${styles.favorites}`}>
      <img src="../../../src/shared/assets/img/like-Default.svg" alt="нотификация" />
    </button>
  );
}
export default Favorites;
