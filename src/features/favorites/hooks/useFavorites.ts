// src/features/favorites/hooks/useFavorites.ts
// Хук работы с избранным, завязанный ТОЛЬКО на skillsSlice и likesReceived
import { useCallback } from 'react';
import { useDispatch, useSelector } from '@app/store';
import { useAuthState } from '@features/auth';
import { addFavorite as addFavoriteSkill, removeFavorite as removeFavoriteSkill } from '@entities/skill/model/skillsSlice';
import type { RootState } from '@app/store';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuthState();
  const userId = currentUser?.id;

  // Массив ID навыков, которые лайкнул текущий пользователь
  const favoriteSkillIds = useSelector((state: RootState) => {
    if (!userId) return [];
    return state.skills.items
      .filter((s) => s.likesReceived.includes(userId))
      .map((s) => s.id);
  });

  const toggleFavorite = useCallback(
    (skillId: number) => {
      if (!userId) return;

      const alreadyLiked = favoriteSkillIds.includes(skillId);

      if (alreadyLiked) {
        dispatch(removeFavoriteSkill({ skillId, userId }));
      } else {
        dispatch(addFavoriteSkill({ skillId, userId }));
      }
    },
    [dispatch, userId, favoriteSkillIds]
  );

  const isFavorite = useCallback(
    (skillId: number) => {
      if (!userId) return false;
      return favoriteSkillIds.includes(skillId);
    },
    [favoriteSkillIds, userId]
  );

  return {
    favoriteSkillIds,
    toggleFavorite,
    isFavorite,
  };
};
