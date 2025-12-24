import type { ThemeMode, ThemeSource } from '../model/types'
import { useDispatch, useSelector } from '@app/store'
import { useEffect } from 'react'
import { applyTheme, createThemeListener, detectSystemTheme, loadTheme, saveTheme } from '../lib'
import { selectIsThemeInitialized, selectThemeMode, selectThemeSource } from '../model/selectors'
import { initializeTheme } from '../model/themeSlice'

/**
 * Hook for initializing theme on mount
 * Handles loading from storage, detecting system preference, and setting up listeners
 */
export default function useThemeInit(): void {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectIsThemeInitialized)
  const mode = useSelector(selectThemeMode)
  const source = useSelector(selectThemeSource)

  // Initialize theme on mount
  useEffect(() => {
    if (isInitialized) {
      return
    }

    const storedTheme = loadTheme()
    const detectedPreference = detectSystemTheme()

    let initialMode: ThemeMode
    let initialSource: ThemeSource

    if (storedTheme && storedTheme.source === 'user') {
      // User has manually set preference
      initialMode = storedTheme.mode
      initialSource = 'user'
    } else if (detectedPreference) {
      // Use system preference
      initialMode = detectedPreference
      initialSource = 'system'
    } else {
      // Fallback to light
      initialMode = 'light'
      initialSource = 'system'
    }

    dispatch(
      initializeTheme({
        mode: initialMode,
        source: initialSource,
        systemPreference: detectedPreference,
      }),
    )

    applyTheme(initialMode)
  }, [dispatch, isInitialized])

  // Subscribe to system preference changes
  useEffect(() => {
    const cleanup = createThemeListener(dispatch)
    return cleanup
  }, [dispatch])

  // Sync theme to DOM and storage on changes
  useEffect(() => {
    if (!isInitialized) {
      return
    }

    applyTheme(mode)
    saveTheme(mode, source)
  }, [mode, source, isInitialized])
}
