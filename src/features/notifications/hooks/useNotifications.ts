import type { UseNotificationsReturn } from '../types'
import { useDispatch, useSelector } from '@app/store'
import {
  clearViewedForUser,
  markAllAsReadForUser,
  markAsRead,
  selectNotificationsLoading,
} from '@entities/notification'
import { useMemo } from 'react'
import {
  selectHasUnreadByUserId,
  selectNewNotificationsByUserId,
  selectViewedNotificationsByUserId,
} from '../model/selectors'

function useNotifications(userId: number): UseNotificationsReturn {
  const dispatch = useDispatch()

  const loading = useSelector(selectNotificationsLoading)

  const newNotifications = useSelector((state) => selectNewNotificationsByUserId(state, userId))
  const viewedNotifications = useSelector((state) =>
    selectViewedNotificationsByUserId(state, userId),
  )
  const hasUnread = useSelector((state) => selectHasUnreadByUserId(state, userId))

  const readAll = useMemo(
    () => () => {
      dispatch(markAllAsReadForUser(userId))
    },
    [dispatch, userId],
  )

  const clearViewed = useMemo(
    () => () => {
      dispatch(clearViewedForUser(userId))
    },
    [dispatch, userId],
  )

  const markNotificationAsRead = useMemo(
    () => (id: number) => {
      dispatch(markAsRead(id))
    },
    [dispatch],
  )

  return {
    newNotifications,
    viewedNotifications,
    hasUnread,
    loading,
    readAll,
    clearViewed,
    markAsRead: markNotificationAsRead,
  }
}

export default useNotifications
