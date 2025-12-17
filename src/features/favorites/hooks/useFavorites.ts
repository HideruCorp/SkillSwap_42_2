// src/features/favorites/hooks/useFavorites.ts
// Хук работы с избранным, завязанный ТОЛЬКО на skillsSlice и likesReceived
import { useCallback } from 'react';
import { useDispatch, useSelector } from '@app/store';
import { useAuthState } from '@features/auth';
import {
  addFavorite as addFavoriteSkill,
  removeFavorite as removeFavoriteSkill,
  selectFavoriteSkillIds,
} from '@entities/skill/model/skillsSlice';

export default function useFavorites() {
  const dispatch = useDispatch();
  const { currentUser } = useAuthState();
  const userId = currentUser?.id;

  // Массив ID навыков, которые лайкнул текущий пользователь
  const favoriteSkillIds = useSelector((state) => {
    if (!userId) return [];
    return selectFavoriteSkillIds(state, userId);
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
