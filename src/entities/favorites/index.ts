import favoritesReducer from './model/favoritesSlice'
import selectSkillLikesMap from './model/selectors'

// Slice
export {
  addFavoriteSkill,
  default as favoritesReducer,
  initializeFavorites,
  removeFavoriteSkill,
  selectAllFavorites,
  selectFavoritesError,
  selectFavoriteSkillIdsByUserId,
  selectFavoritesLoading,
  selectIsSkillLikedByUser,
  selectSkillLikesCount,
  selectUserIdsWhoLikedSkill,
  setFavoritesError,
  setFavoritesLoading,
} from './model/favoritesSlice'

// Types
export type { Favorite, FavoritesState, StoredFavorite } from './model/types'

export { selectSkillLikesMap }

export default favoritesReducer
