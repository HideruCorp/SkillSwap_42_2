// src/features/favorites/hooks/useFavorites.ts
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, loadFavoritesFromStorage } from '../model/favoritesSlice';
import { selectFavorites } from '../model/selectors';
import type { RootState } from '@app/store';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  // Загружаем избранное при монтировании компонента
  useEffect(() => {
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  const handleToggleFavorite = useCallback((userId: number) => {
    dispatch(toggleFavorite(userId));
  }, [dispatch]);

  const isFavorite = useCallback((userId: number) => {
    return favorites.includes(userId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite: handleToggleFavorite,
    isFavorite,
  };
};
