import SunIcon from '@shared/assets/img/sun.svg?react';
import MoonIcon from '@shared/assets/img/moon.svg?react';
import { useTheme } from '@features/theme';
import styles from './theme-toggler.module.scss';

/**
 * ThemeToggler Component
 * Toggles between light and dark theme modes.
 * Displays sun icon in dark mode, moon icon in light mode.
 * Uses theme state from Redux and persists preference to localStorage.
 */
function ThemeToggler() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.themeToggler}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeToggler;
