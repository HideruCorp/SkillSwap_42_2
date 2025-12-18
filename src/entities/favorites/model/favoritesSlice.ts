import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserId } from '@shared/types';
import { loadInitialFavorites } from '@shared/lib/storage/dataMerger';
import type { FavoritesState } from './types';

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null,
};

/**
 * Инициализация избранного из IndexedDB или миграция из skills.json
 * При первой загрузке извлекает likesReceived из skills.json
 * При последующих загрузках читает из IndexedDB
 */
export const initializeFavorites = createAsyncThunk('favorites/initialize', async () => {
  const favorites = await loadInitialFavorites();
  return favorites.map((f) => ({
    userId: f.userId,
    skillId: f.skillId,
    createdAt: f.createdAt,
  }));
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    /**
     * Add a favorite (like a skill)
     */
    addFavoriteSkill(state, action: PayloadAction<{ skillId: number; userId: UserId }>) {
      const { skillId, userId } = action.payload;
      const exists = state.items.some((f) => f.skillId === skillId && f.userId === userId);

      if (!exists) {
        state.items.push({
          userId,
          skillId,
          createdAt: new Date().toISOString(),
        });
      }
    },

    /**
     * Remove a favorite (unlike a skill)
     */
    removeFavoriteSkill(state, action: PayloadAction<{ skillId: number; userId: UserId }>) {
      const { skillId, userId } = action.payload;
      state.items = state.items.filter((f) => !(f.skillId === skillId && f.userId === userId));
    },

    setFavoritesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setFavoritesError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load favorites';
      });
  },
  selectors: {
    /**
     * Get all favorites
     */
    selectAllFavorites: (state) => state.items,

    /**
     * Get all skill IDs liked by a specific user
     */
    selectFavoriteSkillIdsByUserId: (state, userId: UserId) =>
      state.items.filter((f) => f.userId === userId).map((f) => f.skillId),

    /**
     * Check if a specific user liked a specific skill
     */
    selectIsSkillLikedByUser: (state, skillId: number, userId: UserId) =>
      state.items.some((f) => f.skillId === skillId && f.userId === userId),

    /**
     * Get all user IDs who liked a specific skill
     */
    selectUserIdsWhoLikedSkill: (state, skillId: number) =>
      state.items.filter((f) => f.skillId === skillId).map((f) => f.userId),

    /**
     * Get likes count for a specific skill
     */
    selectSkillLikesCount: (state, skillId: number) =>
      state.items.filter((f) => f.skillId === skillId).length,

    selectFavoritesLoading: (state) => state.isLoading,
    selectFavoritesError: (state) => state.error,
  },
});

export const { addFavoriteSkill, removeFavoriteSkill, setFavoritesLoading, setFavoritesError } =
  favoritesSlice.actions;

export const {
  selectAllFavorites,
  selectFavoriteSkillIdsByUserId,
  selectIsSkillLikedByUser,
  selectUserIdsWhoLikedSkill,
  selectSkillLikesCount,
  selectFavoritesLoading,
  selectFavoritesError,
} = favoritesSlice.selectors;

export default favoritesSlice.reducer;
