// src/features/favorites/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('skillswap_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log('📋 Загружен полный список избранного:', parsed);
        }
      } else {
        console.log('📋 Список избранного пуст');
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('skillswap_favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('skillswap_favorites');
    }
  }, [favorites]);

  const toggleFavorite = useCallback((userId: number) => {
    setFavorites(prev => {
      let newFavorites: number[];

      if (prev.includes(userId)) {
        newFavorites = prev.filter(id => id !== userId);
      } else {
        newFavorites = [...prev, userId];
      }

      console.log('📋 Полный список избранного после изменения:', newFavorites);
      console.log('📊 Всего избранных:', newFavorites.length);

      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((userId: number) => {
    return favorites.includes(userId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading,
  };
};