import type { RootState } from '@app/store'
import type { Notification } from '@entities/notification'
import { createSelector } from '@reduxjs/toolkit'

const selectNotificationsItems = (state: RootState) => state.notifications.items

const selectUserId = (_state: RootState, userId: number) => userId

const selectNotificationsByUserIdMemoized = createSelector(
  [selectNotificationsItems, selectUserId],
  (items, userId): Notification[] => items.filter((item) => item.userId === userId),
)

export const selectNewNotificationsByUserId = createSelector(
  [selectNotificationsByUserIdMemoized],
  (notifications): Notification[] => notifications.filter((item) => !item.readed),
)

export const selectViewedNotificationsByUserId = createSelector(
  [selectNotificationsByUserIdMemoized],
  (notifications): Notification[] => notifications.filter((item) => item.readed),
)

export const selectHasUnreadByUserId = createSelector(
  [selectNewNotificationsByUserId],
  (newNotifications): boolean => newNotifications.length > 0,
)
