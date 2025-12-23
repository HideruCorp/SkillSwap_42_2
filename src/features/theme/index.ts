// Model layer exports
export type { ThemeMode, ThemeSource, ThemeState } from './model';
export {
  THEME_STORAGE_KEY,
  DEFAULT_THEME,
  toggleTheme,
  setTheme,
  initializeTheme,
  setSystemPreference,
  resetToSystemPreference,
  themeReducer,
  selectThemeState,
  selectThemeMode,
  selectThemeSource,
  selectIsThemeInitialized,
  selectSystemPreference,
  selectIsDarkMode,
  selectIsUsingSystemPreference,
} from './model';

// Lib layer exports
export {
  saveTheme,
  loadTheme,
  removeTheme,
  detectSystemTheme,
  isSystemThemeSupported,
  applyTheme,
  preventThemeFlash,
  createThemeListener,
} from './lib';

// Hooks exports
export { useTheme, type UseThemeReturn, useThemeInit } from './hooks';
