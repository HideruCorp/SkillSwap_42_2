// Hooks exports
export { useTheme, useThemeInit, type UseThemeReturn } from './hooks'
// Lib layer exports
export {
  applyTheme,
  createThemeListener,
  detectSystemTheme,
  isSystemThemeSupported,
  loadTheme,
  preventThemeFlash,
  removeTheme,
  saveTheme,
} from './lib'

// Model layer exports
export type { ThemeMode, ThemeSource, ThemeState } from './model'

export {
  DEFAULT_THEME,
  initializeTheme,
  resetToSystemPreference,
  selectIsDarkMode,
  selectIsThemeInitialized,
  selectIsUsingSystemPreference,
  selectSystemPreference,
  selectThemeMode,
  selectThemeSource,
  selectThemeState,
  setSystemPreference,
  setTheme,
  THEME_STORAGE_KEY,
  themeReducer,
  toggleTheme,
} from './model'
