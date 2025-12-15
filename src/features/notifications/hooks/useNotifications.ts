import { useEffect, useMemo } from 'react';
import {
  fetchNotifications,
  markAsRead,
  markAllAsReadForUser,
  clearViewedForUser,
  selectNotificationsLoading,
  selectAllNotifications,
} from '@entities/notification';
import { useDispatch, useSelector } from '@app/store';
import {
  selectNewNotificationsByUserId,
  selectViewedNotificationsByUserId,
  selectHasUnreadByUserId,
} from '../model/selectors';
import type { UseNotificationsReturn } from '../types';

function useNotifications(userId: number): UseNotificationsReturn {
  const dispatch = useDispatch();

  const loading = useSelector(selectNotificationsLoading);
  const allNotifications = useSelector(selectAllNotifications);

  const newNotifications = useSelector((state) => selectNewNotificationsByUserId(state, userId));
  const viewedNotifications = useSelector((state) =>
    selectViewedNotificationsByUserId(state, userId)
  );
  const hasUnread = useSelector((state) => selectHasUnreadByUserId(state, userId));

  useEffect(() => {
    if (allNotifications.length === 0 && !loading) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, allNotifications.length, loading]);

  const readAll = useMemo(
    () => () => {
      dispatch(markAllAsReadForUser(userId));
    },
    [dispatch, userId]
  );

  const clearViewed = useMemo(
    () => () => {
      dispatch(clearViewedForUser(userId));
    },
    [dispatch, userId]
  );

  const markNotificationAsRead = useMemo(
    () => (id: number) => {
      dispatch(markAsRead(id));
    },
    [dispatch]
  );

  return {
    newNotifications,
    viewedNotifications,
    hasUnread,
    loading,
    readAll,
    clearViewed,
    markAsRead: markNotificationAsRead,
  };
}

export default useNotifications;
