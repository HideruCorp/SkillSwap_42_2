import type { ThemeMode, ThemeSource } from '../model/types';
import { THEME_STORAGE_KEY } from '../model/types';

interface StoredTheme {
  mode: ThemeMode;
  source: ThemeSource;
  timestamp: number;
}

/**
 * Saves theme preference to localStorage
 */
export function saveTheme(mode: ThemeMode, source: ThemeSource): void {
  try {
    const data: StoredTheme = {
      mode,
      source,
      timestamp: Date.now(),
    };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[ThemeStorage] Failed to save theme:', error);
  }
}

/**
 * Loads theme preference from localStorage
 */
export function loadTheme(): StoredTheme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as StoredTheme;

    // Validate stored data
    if (!parsed.mode || !['light', 'dark'].includes(parsed.mode)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('[ThemeStorage] Failed to load theme:', error);
    return null;
  }
}

/**
 * Removes theme preference from localStorage
 */
export function removeTheme(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('[ThemeStorage] Failed to remove theme:', error);
  }
}
