import { useCallback } from 'react';
import { useSelector } from '@app/store';
import { useDispatch } from 'react-redux';
import { toggleUserLike } from '@/entities/user/model/userLikesSlice';
import { selectCurrentUserId } from '@/features/auth/model/selectors';

const useFavorites = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);

  const allLikes = useSelector((state) => state.userLikes.likes);

  const favoriteUserIds = currentUserId ? (allLikes[currentUserId] || []) : [];

  const isFavorite = useCallback((targetUserId: number): boolean => {
    if (!currentUserId) return false;
    return favoriteUserIds.includes(targetUserId);
  }, [currentUserId, favoriteUserIds]);

  const toggleFavorite = useCallback((targetUserId: number) => {
    if (currentUserId) {
      dispatch(toggleUserLike({
        userId: currentUserId,
        targetUserId
      }));
    }
  }, [dispatch, currentUserId]);

  return {
    favoriteUserIds,
    isFavorite,
    toggleFavorite,
    currentUserId,
  };
};

export default useFavorites;