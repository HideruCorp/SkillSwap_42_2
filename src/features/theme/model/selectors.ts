import type { RootState } from '@app/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectThemeState = (state: RootState) => state.theme

export const selectThemeMode = (state: RootState) => state.theme.mode

export const selectThemeSource = (state: RootState) => state.theme.source

export const selectIsThemeInitialized = (state: RootState) => state.theme.isInitialized

export const selectSystemPreference = (state: RootState) => state.theme.systemPreference

/**
 * Memoized selector - checks if dark mode is active
 */
export const selectIsDarkMode = createSelector([selectThemeMode], (mode) => mode === 'dark')

/**
 * Memoized selector - checks if using system preference
 */
export const selectIsUsingSystemPreference = createSelector(
  [selectThemeSource],
  (source) => source === 'system',
)
