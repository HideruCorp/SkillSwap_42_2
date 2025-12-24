import type { ThemeMode } from '../model/types'

/**
 * Detects current system theme preference
 * Returns 'dark' or 'light', defaulting to 'light' if detection fails
 */
export function detectSystemTheme(): ThemeMode {
  if (!window.matchMedia) {
    return 'light'
  }

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return darkModeQuery.matches ? 'dark' : 'light'
}

/**
 * Checks if browser supports prefers-color-scheme
 */
export function isSystemThemeSupported(): boolean {
  return Boolean(window.matchMedia)
}
