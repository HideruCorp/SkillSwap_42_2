import type { RootState } from '@app/store'
import type { Notification, NotificationsState } from './types'
import { createSelector } from '@reduxjs/toolkit'

// Базовые селекторы (не требуют мемоизации - просто возвращают ссылку)
export function selectNotificationsState(state: RootState): NotificationsState {
  return state.notifications
}

export function selectAllNotifications(state: RootState): Notification[] {
  return state.notifications.items
}

export function selectNotificationsLoading(state: RootState): boolean {
  return state.notifications.loading
}

export function selectNotificationsError(state: RootState): string | null {
  return state.notifications.error
}

// Селекторы с параметрами - нужна мемоизация
const selectNotificationsItems = (state: RootState) => state.notifications.items
const selectNotificationId = (_state: RootState, id: number) => id
const selectUserId = (_state: RootState, userId: number) => userId
const selectRequestId = (_state: RootState, requestId: number) => requestId

export const selectNotificationById = createSelector(
  [selectNotificationsItems, selectNotificationId],
  (items, id): Notification | undefined => items.find((item) => item.id === id),
)

export const selectNotificationsByUserId = createSelector(
  [selectNotificationsItems, selectUserId],
  (items, userId): Notification[] => items.filter((item) => item.userId === userId),
)

export const selectNotificationsByRequestId = createSelector(
  [selectNotificationsItems, selectRequestId],
  (items, requestId): Notification[] => items.filter((item) => item.requestId === requestId),
)
