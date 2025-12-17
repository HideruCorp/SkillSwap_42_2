import { createSelector } from '@reduxjs/toolkit';
import type { Request } from '@shared/types';
import type { RootState } from '@app/store';

/**
 * Базовые селекторы для requests entity
 * Содержат только селекторы, работающие со своим state
 * Cross-slice селекторы вынесены в features/requests
 */

// Базовые селекторы
export const selectRequestsState = (state: RootState) => state.requests;

export const selectAllRequests = (state: RootState): Request[] => state.requests.items;

export const selectRequestsLoading = (state: RootState): boolean => state.requests.isLoading;

export const selectRequestsError = (state: RootState): string | null => state.requests.error;

// Input selectors для мемоизации
const selectRequestsItems = (state: RootState) => state.requests.items;
const selectRequestId = (_state: RootState, id: number) => id;
const selectUserId = (_state: RootState, userId: number) => userId;

// Селектор по ID
export const selectRequestById = createSelector(
  [selectRequestsItems, selectRequestId],
  (items, id): Request | undefined => items.find((item) => item.id === id)
);

// Исходящие заявки (где fromUser === currentUserId)
export const selectOutgoingRequests = createSelector(
  [selectRequestsItems, selectUserId],
  (items, userId): Request[] => items.filter((item) => item.fromUser === userId)
);

// Заявки по статусу
export const selectPendingRequests = createSelector([selectRequestsItems], (items): Request[] =>
  items.filter((item) => item.status === 'pending')
);

export const selectAcceptedRequests = createSelector([selectRequestsItems], (items): Request[] =>
  items.filter((item) => item.status === 'accepted')
);

export const selectRejectedRequests = createSelector([selectRequestsItems], (items): Request[] =>
  items.filter((item) => item.status === 'rejected')
);

// Исходящие pending заявки для текущего пользователя
export const selectOutgoingPendingRequests = createSelector(
  [selectRequestsItems, selectUserId],
  (items, userId): Request[] =>
    items.filter((item) => item.fromUser === userId && item.status === 'pending')
);
