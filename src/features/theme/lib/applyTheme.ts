import type { ThemeMode } from '../model/types'

/**
 * Applies theme to document element
 * Sets data-theme attribute for CSS targeting
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  // Set data-theme attribute for CSS selectors
  root.setAttribute('data-theme', mode)

  // Also set as class for backward compatibility
  root.classList.remove('theme-light', 'theme-dark')
  root.classList.add(`theme-${mode}`)
}

/**
 * Prevents FOUC (Flash of Unstyled Content) during initial load
 * Should be called before React hydration in index.html
 */
export function preventThemeFlash(): void {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') {
    return
  }

  const stored = localStorage.getItem('skillswap-theme')

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { mode?: string }
      if (parsed.mode === 'dark' || parsed.mode === 'light') {
        document.documentElement.setAttribute('data-theme', parsed.mode)
        return
      }
    } catch {
      // Continue to system detection
    }
  }

  // Fallback to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}
