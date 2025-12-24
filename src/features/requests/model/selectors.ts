import type { RootState } from '@app/store'
import type { Request } from '@shared/types'
import { createSelector } from '@reduxjs/toolkit'

/**
 * Cross-slice селекторы для requests
 * Эти селекторы требуют данные из других слайсов (skills),
 * поэтому находятся в features слое согласно FSD
 */

// Input selectors
const selectRequestsItems = (state: RootState) => state.requests.items
const selectSkillsItems = (state: RootState) => state.skills.items
const selectUserId = (_state: RootState, userId: number) => userId

/**
 * Входящие заявки (где skill.userId === currentUserId)
 * Требует join с skills для получения владельца скилла
 */
export const selectIncomingRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return requests.filter((request) => {
      const skillOwnerId = skillOwnerMap.get(request.requestedSkill)
      return skillOwnerId === userId
    })
  },
)

/**
 * Входящие pending заявки для текущего пользователя
 */
export const selectIncomingPendingRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return requests.filter((request) => {
      const skillOwnerId = skillOwnerMap.get(request.requestedSkill)
      return skillOwnerId === userId && request.status === 'pending'
    })
  },
)

/**
 * Архивные заявки (accepted/rejected) — как входящие, так и исходящие
 * Отсортированы по дате создания (новые первыми)
 */
export const selectArchivedRequests = createSelector(
  [selectRequestsItems, selectSkillsItems, selectUserId],
  (requests, skills, userId): Request[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return requests
      .filter((request) => {
        if (request.status === 'pending')
          return false
        const skillOwnerId = skillOwnerMap.get(request.requestedSkill)
        // Include if user is sender OR skill owner
        return skillOwnerId === userId || request.fromUser === userId
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
)
