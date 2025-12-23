import type { RootState } from '@app/store';
import type { Favorite } from './types';

/**
 * Глобальный селектор: мапа skillId -> количество лайков
 * Используется для сортировки скиллов
 */
/**
 * Глобальный селектор: мапа skillId -> количество лайков
 * Используется для сортировки скиллов
 */
const selectSkillLikesMap = (state: RootState): Record<number, number> => {
  const map: Record<number, number> = {};

  // Защита от undefined/null
  const favorites = state.favorites?.items;
  if (!favorites || !Array.isArray(favorites)) {
    return map;
  }

  favorites.forEach((fav: Favorite) => {
    if (fav?.skillId !== undefined) {
      map[fav.skillId] = (map[fav.skillId] || 0) + 1;
    }
  });

  return map;
};

export default selectSkillLikesMap;
