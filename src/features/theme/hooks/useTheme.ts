import { useCallback } from 'react';
import { useDispatch, useSelector } from '@app/store';
import {
  toggleTheme as toggleThemeAction,
  setTheme as setThemeAction,
  resetToSystemPreference as resetAction,
} from '../model/themeSlice';
import {
  selectThemeMode,
  selectThemeSource,
  selectIsThemeInitialized,
  selectSystemPreference,
  selectIsDarkMode,
} from '../model/selectors';
import type { ThemeMode } from '../model/types';

export interface UseThemeReturn {
  mode: ThemeMode;
  isDarkMode: boolean;
  isInitialized: boolean;
  source: 'user' | 'system';
  systemPreference: ThemeMode | null;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  resetToSystemPreference: () => void;
}

/**
 * Hook providing theme state and actions
 */
export function useTheme(): UseThemeReturn {
  const dispatch = useDispatch();

  const mode = useSelector(selectThemeMode);
  const source = useSelector(selectThemeSource);
  const isInitialized = useSelector(selectIsThemeInitialized);
  const systemPreference = useSelector(selectSystemPreference);
  const isDarkMode = useSelector(selectIsDarkMode);

  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const setTheme = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeAction(newMode));
    },
    [dispatch]
  );

  const resetToSystemPreference = useCallback(() => {
    dispatch(resetAction());
  }, [dispatch]);

  return {
    mode,
    isDarkMode,
    isInitialized,
    source,
    systemPreference,
    toggleTheme,
    setTheme,
    resetToSystemPreference,
  };
}
