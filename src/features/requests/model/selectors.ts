import { createSelector } from '@reduxjs/toolkit';
import type { Request } from '@shared/types';
import type { RootState } from '@app/store';

/**
 * Cross-slice селекторы для requests
 * Эти селекторы требуют данные из других слайсов (skills),
 * поэтому находятся в features слое согласно FSD
 */

// Input selectors
const selectRequestsItems = (state: RootState) => state.requests.items;
const selectSkillsItems = (state: RootState) => state.skills.items;
const selectUserId = (_state: RootState, userId: number) => userId;

/**
 * Входящие заявки (где skill.userId === currentUserId)
 * Требует join с skills для получения владельца скилла
 */
export const selectIncomingRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]));

    return requests.filter((request) => {
      const skillOwnerId = skillOwnerMap.get(request.requestedSkill);
      return skillOwnerId === userId;
    });
  }
);

/**
 * Входящие pending заявки для текущего пользователя
 */
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
