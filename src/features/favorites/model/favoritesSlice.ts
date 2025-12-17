// src/features/favorites/model/favoritesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favorites: number[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    loadFavoritesFromStorage: (state) => {
      state.loading = true;
      try {
        const saved = localStorage.getItem('skillswap_favorites');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            state.favorites = parsed;
            console.log('Загружен полный список избранного из localStorage:', parsed);
          }
        } else {
          console.log('Список избранного пуст');
        }
      } catch (error) {
        state.error = 'Ошибка загрузки избранного';
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        state.loading = false;
      }
    },

    toggleFavorite: (state, action: PayloadAction<number>) => {
      const userId = action.payload;

      if (state.favorites.includes(userId)) {
        state.favorites = state.favorites.filter(id => id !== userId);
        console.log('Удален пользователь из избранного. ID:', userId);
      } else {
        state.favorites.push(userId);
        console.log('Добавлен пользователь в избранное. ID:', userId);
      }

      localStorage.setItem('skillswap_favorites', JSON.stringify(state.favorites));

      const favoritesCopy = [...state.favorites];
      console.log('Полный список избранного после изменения:', favoritesCopy);
      console.log('Всего избранных:', favoritesCopy.length);
    },

    addFavorite: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      if (!state.favorites.includes(userId)) {
        state.favorites.push(userId);
        localStorage.setItem('skillswap_favorites', JSON.stringify(state.favorites));
      }
    },

    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      localStorage.setItem('skillswap_favorites', JSON.stringify(state.favorites));
    },

    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('skillswap_favorites');
    },
  },
});

export const {
  loadFavoritesFromStorage,
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
