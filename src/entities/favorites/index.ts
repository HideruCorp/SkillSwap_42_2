import favoritesReducer from './model/favoritesSlice';
import selectSkillLikesMap from './model/selectors';

// Types
export type { Favorite, FavoritesState, StoredFavorite } from './model/types';

// Slice
export {
  default as favoritesReducer,
  initializeFavorites,
  addFavoriteSkill,
  removeFavoriteSkill,
  setFavoritesLoading,
  setFavoritesError,
  selectAllFavorites,
  selectFavoriteSkillIdsByUserId,
  selectIsSkillLikedByUser,
  selectUserIdsWhoLikedSkill,
  selectSkillLikesCount,
  selectFavoritesLoading,
  selectFavoritesError,
} from './model/favoritesSlice';

export { selectSkillLikesMap };

export default favoritesReducer;
