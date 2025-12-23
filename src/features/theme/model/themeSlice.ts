import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode, ThemeSource, ThemeState } from './types';

interface InitializeThemePayload {
  mode: ThemeMode;
  source: ThemeSource;
  systemPreference: ThemeMode | null;
}

const initialState: ThemeState = {
  mode: 'light',
  source: 'system',
  isInitialized: false,
  systemPreference: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * User manually toggles theme between light and dark
     */
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.source = 'user';
    },

    /**
     * User manually sets specific theme
     */
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.source = 'user';
    },

    /**
     * Initialize theme from storage or system preference
     */
    initializeTheme(state, action: PayloadAction<InitializeThemePayload>) {
      state.mode = action.payload.mode;
      state.source = action.payload.source;
      state.systemPreference = action.payload.systemPreference;
      state.isInitialized = true;
    },

    /**
     * Update system preference when it changes at OS/browser level
     */
    setSystemPreference(state, action: PayloadAction<ThemeMode>) {
      state.systemPreference = action.payload;
      // Only update mode if user hasn't manually set preference
      if (state.source === 'system') {
        state.mode = action.payload;
      }
    },

    /**
     * Reset to system preference
     */
    resetToSystemPreference(state) {
      state.mode = state.systemPreference || 'light';
      state.source = 'system';
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  initializeTheme,
  setSystemPreference,
  resetToSystemPreference,
} = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
export default themeReducer;
