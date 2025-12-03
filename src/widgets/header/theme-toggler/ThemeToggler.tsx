import styles from './theme-toggler.module.scss';

function ThemeToggler() {
  return (
    <button type="button" className={`${styles.themeToggler}`}>
      <img src="../../../src/shared/assets/img/moon.svg" alt="Переключение темы" />
    </button>
  );
}

export default ThemeToggler;
