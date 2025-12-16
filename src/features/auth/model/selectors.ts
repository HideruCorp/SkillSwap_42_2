import { createSelector } from '@reduxjs/toolkit';
import type { User } from '@shared/types';
import type { RootState } from '@app/store';

// ============ BASE SELECTORS ============

const selectAuthState = (state: RootState) => state.auth;
const selectUsersItems = (state: RootState) => state.users.items;

export const selectTokens = (state: RootState) => selectAuthState(state).tokens;
export const selectCurrentUserId = (state: RootState) => selectAuthState(state).currentUserId;
export const selectAuthChecked = (state: RootState) => selectAuthState(state).checked;

// ============ MEMOIZED SELECTORS ============

/**
 * Проверяет, авторизован ли пользователь:
 * - есть токены
 * - есть currentUserId
 * - пользователь существует в users store
 */
export const selectIsAuthenticated = createSelector(
  [selectTokens, selectCurrentUserId, selectUsersItems],
  (tokens, userId, users: User[]) => Boolean(tokens && userId && users.some((u) => u.id === userId))
);

/**
 * Возвращает текущего авторизованного пользователя или null
 */
export const selectCurrentUser = createSelector(
  [selectCurrentUserId, selectUsersItems],
  (userId, users: User[]) => (userId ? (users.find((u) => u.id === userId) ?? null) : null)
);
