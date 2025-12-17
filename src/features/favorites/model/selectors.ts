// ⚠️Этот файл больше не используется!
// Логика избранного перенесена в skillsSlice (likesReceived).
// Эти селекторы ссылаются на несуществующий reducer 'favorites' и вызовут ошибку.
// Используйте вместо этого:
// - selectFavoriteSkillIds из @entities/skill/model/skillsSlice
// - selectIsSkillLiked из @entities/skill/model/skillsSlice
// - useFavorites hook из @features/favorites

// src/features/favorites/model/selectors.ts
// import { createSelector } from '@reduxjs/toolkit';
// import type { RootState } from '@app/store';

// Закомментировано, т.к. reducer 'favorites' больше не существует в store
// export const selectFavorites = (state: RootState) => state.favorites.favorites;
// export const selectFavoritesLoading = (state: RootState) => state.favorites.loading;
// export const selectFavoritesError = (state: RootState) => state.favorites.error;

// export const selectIsFavorite = (userId: number) =>
//   createSelector(
//     [selectFavorites],
//     (favorites) => favorites.includes(userId)
//   );
