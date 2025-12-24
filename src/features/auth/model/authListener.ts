import type { AppDispatch } from '@app/store'
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { bootstrapAuth, login, logout } from './authSlice'

/**
 * Listener middleware для автоматического логаута при истечении токена
 */
const authListener = createListenerMiddleware()

let logoutTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Планирует автоматический logout по истечении токена
 */
function scheduleAutoLogout(dispatch: AppDispatch, expiresAt: number): void {
  // Отменяем предыдущий таймер если был
  if (logoutTimer) {
    clearTimeout(logoutTimer)
    logoutTimer = null
  }

  const delay = Math.max(0, expiresAt - Date.now())

  logoutTimer = setTimeout(() => {
    dispatch(logout())
  }, delay)
}

/**
 * Отменяет запланированный автологаут
 */
function cancelAutoLogout(): void {
  if (logoutTimer) {
    clearTimeout(logoutTimer)
    logoutTimer = null
  }
}

// Слушаем успешный login — планируем автологаут
authListener.startListening({
  actionCreator: login.fulfilled,
  effect: (action, listenerApi) => {
    const {
      tokens: { expiresAt },
    } = action.payload
    scheduleAutoLogout(listenerApi.dispatch as AppDispatch, expiresAt)
  },
})

// Слушаем успешный bootstrap — планируем автологаут если есть токены
authListener.startListening({
  actionCreator: bootstrapAuth.fulfilled,
  effect: (action, listenerApi) => {
    const { tokens } = action.payload
    if (tokens?.expiresAt) {
      scheduleAutoLogout(listenerApi.dispatch as AppDispatch, tokens.expiresAt)
    }
  },
})

// При logout отменяем таймер
authListener.startListening({
  actionCreator: logout.fulfilled,
  effect: () => {
    cancelAutoLogout()
  },
})

export default authListener
