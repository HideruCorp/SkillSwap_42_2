// src/features/favorites/model/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';

export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectFavoritesLoading = (state: RootState) => state.favorites.loading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;

export const selectIsFavorite = (userId: number) =>
  createSelector(
    [selectFavorites],
    (favorites) => favorites.includes(userId)
  );
