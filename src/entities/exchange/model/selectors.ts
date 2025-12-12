import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../services/store';
import type { Exchange } from '@shared/types';

// Базовые селекторы
export const selectExchangesState = (state: RootState) => state.exchanges;

export const selectAllExchanges = (state: RootState): Exchange[] => state.exchanges.items;

export const selectExchangesLoading = (state: RootState): boolean => state.exchanges.isLoading;

export const selectExchangesError = (state: RootState): string | null => state.exchanges.error;

// Input selectors для мемоизации
const selectExchangesItems = (state: RootState) => state.exchanges.items;
const selectRequestsItems = (state: RootState) => state.requests.items;
const selectSkillsItems = (state: RootState) => state.skills.items;
const selectExchangeId = (_state: RootState, id: number) => id;
const selectUserId = (_state: RootState, userId: number) => userId;

// Селектор по ID
export const selectExchangeById = createSelector(
  [selectExchangesItems, selectExchangeId],
  (items, id): Exchange | undefined => items.find((item) => item.id === id)
);

// Обмены пользователя (где пользователь участвует через skills)
// Exchange содержит skills: [SkillId, SkillId], нужно найти владельцев этих скиллов
export const selectExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    // Создаём Map для быстрого поиска владельца скилла
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return exchanges.filter((exchange) => {
      const [skill1, skill2] = exchange.skills;
      const owner1 = skillOwnerMap.get(skill1);
      const owner2 = skillOwnerMap.get(skill2);
      return owner1 === userId || owner2 === userId;
    });
  }
);

// Активные обмены пользователя
export const selectActiveExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return exchanges.filter((exchange) => {
      if (exchange.status !== 'inProgress') return false;
      const [skill1, skill2] = exchange.skills;
      const owner1 = skillOwnerMap.get(skill1);
      const owner2 = skillOwnerMap.get(skill2);
      return owner1 === userId || owner2 === userId;
    });
  }
);

// Завершённые обмены пользователя
export const selectCompletedExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return exchanges.filter((exchange) => {
      if (exchange.status !== 'completed') return false;
      const [skill1, skill2] = exchange.skills;
      const owner1 = skillOwnerMap.get(skill1);
      const owner2 = skillOwnerMap.get(skill2);
      return owner1 === userId || owner2 === userId;
    });
  }
);

// Обмены по статусу
export const selectActiveExchanges = createSelector([selectExchangesItems], (items): Exchange[] =>
  items.filter((item) => item.status === 'inProgress')
);

export const selectCompletedExchanges = createSelector(
  [selectExchangesItems],
  (items): Exchange[] => items.filter((item) => item.status === 'completed')
);

export const selectCancelledExchanges = createSelector(
  [selectExchangesItems],
  (items): Exchange[] => items.filter((item) => item.status === 'cancelled')
);

// Селектор для получения обмена по requestId
export const selectExchangeByRequestId = createSelector(
  [selectExchangesItems, (_state: RootState, requestId: number) => requestId],
  (items, requestId): Exchange | undefined => items.find((item) => item.requestId === requestId)
);

// Проверка, есть ли у заявки связанный обмен
export const selectHasExchangeForRequest = createSelector(
  [selectExchangesItems, selectRequestsItems, (_state: RootState, requestId: number) => requestId],
  (exchanges, _requests, requestId): boolean =>
    exchanges.some((exchange) => exchange.requestId === requestId)
);
