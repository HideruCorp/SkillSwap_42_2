import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('skillswap_favorites');
      console.log('Загружаем избранное из localStorage:', saved);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log('Избранное загружено:', parsed);
        }
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
      console.log('Сохраняем избранное в localStorage:', favorites);
      localStorage.setItem('skillswap_favorites', JSON.stringify(favorites));
    } else {
      console.log('🗑Очищаем избранное в localStorage');
      localStorage.removeItem('skillswap_favorites');
    }
  }, [favorites]);

  const toggleFavorite = useCallback((userId: number) => {
    console.log('Toggle favorite для пользователя:', userId);
    console.log('Текущие избранные:', favorites);

    setFavorites(prev => {
      if (prev.includes(userId)) {
        const newFavorites = prev.filter(id => id !== userId);
        console.log('🗑Удаляем из избранного. Новый список:', newFavorites);
        return newFavorites;
      } else {
        const newFavorites = [...prev, userId];
        console.log('❤Добавляем в избранное. Новый список:', newFavorites);
        return newFavorites;
      }
    });
  }, [favorites]);

  const isFavorite = useCallback((userId: number) => {
    const result = favorites.includes(userId);
    console.log(`Проверка пользователя ${userId}: ${result ? 'В избранном' : 'Не в избранном'}`);
    return result;
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading,
  };
};