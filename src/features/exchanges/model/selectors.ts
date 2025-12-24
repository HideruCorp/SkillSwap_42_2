import type { RootState } from '@app/store'
import type { Exchange } from '@shared/types'
import { createSelector } from '@reduxjs/toolkit'

/**
 * Cross-slice селекторы для exchanges
 * Эти селекторы требуют данные из других слайсов (skills),
 * поэтому находятся в features слое согласно FSD
 */

// Input selectors
const selectExchangesItems = (state: RootState) => state.exchanges.items
const selectSkillsItems = (state: RootState) => state.skills.items
const selectUserId = (_state: RootState, userId: number) => userId

/**
 * Обмены пользователя (где пользователь участвует через skills)
 * Exchange содержит skills: [SkillId, SkillId], нужно найти владельцев этих скиллов
 */
export const selectExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return exchanges.filter((exchange) => {
      const [skill1, skill2] = exchange.skills
      const owner1 = skillOwnerMap.get(skill1)
      const owner2 = skillOwnerMap.get(skill2)
      return owner1 === userId || owner2 === userId
    })
  },
)

/**
 * Активные обмены пользователя
 */
export const selectActiveExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return exchanges.filter((exchange) => {
      if (exchange.status !== 'inProgress')
        return false
      const [skill1, skill2] = exchange.skills
      const owner1 = skillOwnerMap.get(skill1)
      const owner2 = skillOwnerMap.get(skill2)
      return owner1 === userId || owner2 === userId
    })
  },
)

/**
 * Архивные обмены пользователя (завершённые или отменённые)
 */
export const selectArchivedExchangesByUserId = createSelector(
  [selectExchangesItems, selectSkillsItems, selectUserId],
  (exchanges, skills, userId): Exchange[] => {
    const skillOwnerMap = new Map(skills.map((s) => [s.id, s.userId]))

    return exchanges.filter((exchange) => {
      // Archived = completed OR cancelled
      if (exchange.status !== 'completed' && exchange.status !== 'cancelled')
        return false
      const [skill1, skill2] = exchange.skills
      const owner1 = skillOwnerMap.get(skill1)
      const owner2 = skillOwnerMap.get(skill2)
      return owner1 === userId || owner2 === userId
    })
  },
)
