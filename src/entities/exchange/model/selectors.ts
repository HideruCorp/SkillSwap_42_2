import type { RootState } from '@app/store'
import type { Exchange } from '@shared/types'
import { createSelector } from '@reduxjs/toolkit'

/**
 * Базовые селекторы для exchanges entity
 * Содержат только селекторы, работающие со своим state
 * Cross-slice селекторы вынесены в features/exchanges
 */

// Базовые селекторы
export const selectExchangesState = (state: RootState) => state.exchanges

export const selectAllExchanges = (state: RootState): Exchange[] => state.exchanges.items

export const selectExchangesLoading = (state: RootState): boolean => state.exchanges.isLoading

export const selectExchangesError = (state: RootState): string | null => state.exchanges.error

// Input selectors для мемоизации
const selectExchangesItems = (state: RootState) => state.exchanges.items
const selectExchangeId = (_state: RootState, id: number) => id

// Селектор по ID
export const selectExchangeById = createSelector(
  [selectExchangesItems, selectExchangeId],
  (items, id): Exchange | undefined => items.find((item) => item.id === id),
)

// Обмены по статусу
export const selectActiveExchanges = createSelector([selectExchangesItems], (items): Exchange[] =>
  items.filter((item) => item.status === 'inProgress'))

export const selectCompletedExchanges = createSelector(
  [selectExchangesItems],
  (items): Exchange[] => items.filter((item) => item.status === 'completed'),
)

export const selectCancelledExchanges = createSelector(
  [selectExchangesItems],
  (items): Exchange[] => items.filter((item) => item.status === 'cancelled'),
)

// Селектор для получения обмена по requestId
export const selectExchangeByRequestId = createSelector(
  [selectExchangesItems, (_state: RootState, requestId: number) => requestId],
  (items, requestId): Exchange | undefined => items.find((item) => item.requestId === requestId),
)

// Проверка, есть ли у заявки связанный обмен (не требует cross-slice, requestId передаётся параметром)
export const selectHasExchangeForRequest = createSelector(
  [selectExchangesItems, (_state: RootState, requestId: number) => requestId],
  (exchanges, requestId): boolean => exchanges.some((exchange) => exchange.requestId === requestId),
)
