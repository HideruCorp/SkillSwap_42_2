import { createSelector } from '@reduxjs/toolkit';
import type { Request } from '@shared/types';
import type { RootState } from '../../../services/store';

// Базовые селекторы
export const selectRequestsState = (state: RootState) => state.requests;

export const selectAllRequests = (state: RootState): Request[] => state.requests.items;

export const selectRequestsLoading = (state: RootState): boolean => state.requests.isLoading;

export const selectRequestsError = (state: RootState): string | null => state.requests.error;

// Input selectors для мемоизации
const selectRequestsItems = (state: RootState) => state.requests.items;
const selectSkillsItems = (state: RootState) => state.skills.items;
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

// Входящие заявки (где skill.userId === currentUserId)
// Требует join с skills для получения владельца скилла
export const selectIncomingRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    // Создаём Map для быстрого поиска владельца скилла
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return requests.filter((request) => {
      const skillOwnerId = skillOwnerMap.get(request.requestedSkill);
      return skillOwnerId === userId;
    });
  }
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

// Входящие pending заявки для текущего пользователя
export const selectIncomingPendingRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return requests.filter((request) => {
      const skillOwnerId = skillOwnerMap.get(request.requestedSkill);
      return skillOwnerId === userId && request.status === 'pending';
    });
  }
);

// Исходящие pending заявки для текущего пользователя
export const selectOutgoingPendingRequests = createSelector(
  [selectRequestsItems, selectUserId],
  (items, userId): Request[] =>
    items.filter((item) => item.fromUser === userId && item.status === 'pending')
);
