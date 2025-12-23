export type ThemeMode = 'light' | 'dark';

export type ThemeSource = 'user' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  source: ThemeSource;
  isInitialized: boolean;
  systemPreference: ThemeMode | null;
}

export const THEME_STORAGE_KEY = 'skillswap-theme';

export const DEFAULT_THEME: ThemeMode = 'light';
