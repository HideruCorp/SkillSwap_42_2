import type { AppDispatch } from '@app/store';
import type { ThemeMode } from '../model/types';
import { setSystemPreference } from '../model/themeSlice';

interface LegacyMediaQueryList extends MediaQueryList {
  addListener(callback: (e: MediaQueryListEvent) => void): void;
  removeListener(callback: (e: MediaQueryListEvent) => void): void;
}

/**
 * Creates system preference listener and returns cleanup function
 * Dispatches action on system preference changes
 */
export default function createThemeListener(dispatch: AppDispatch): () => void {
  if (!window.matchMedia) {
    return () => {};
  }

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    const newPreference: ThemeMode = e.matches ? 'dark' : 'light';
    dispatch(setSystemPreference(newPreference));
  };

  // Modern API (addEventListener)
  if (darkModeQuery.addEventListener) {
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }

  // Legacy API (addListener) - for older browsers
  const legacyQuery = darkModeQuery as LegacyMediaQueryList;
  if (legacyQuery.addListener) {
    legacyQuery.addListener(handler);
    return () => legacyQuery.removeListener(handler);
  }

  return () => {};
}
