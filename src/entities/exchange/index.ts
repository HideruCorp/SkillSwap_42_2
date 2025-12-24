import exchangesReducer from './model/exchangesSlice'

export type { ExchangesState } from './model/exchangesSlice'
// Slice
export {
  addExchange,
  cancelExchange,
  completeExchange,
  deleteExchange,
  default as exchangesReducer,
  initializeExchanges,
  setExchanges,
  setExchangesError,
  setExchangesLoading,
  updateExchange,
} from './model/exchangesSlice'

// Selectors (from slice) - только базовые селекторы, работающие со своим state
export {
  selectActiveExchanges,
  selectAllExchanges,
  selectCancelledExchanges,
  selectCompletedExchanges,
  selectExchangeById,
  selectExchangeByRequestId,
  selectExchangesByStatus,
  selectExchangesError,
  selectExchangesLoading,
} from './model/exchangesSlice'

// Memoized selectors (только те, что не требуют cross-slice данных)
export { selectExchangesState, selectHasExchangeForRequest } from './model/selectors'

// Types
export type { Exchange, ExchangeStatus } from './model/types'

// Cross-slice селекторы (selectExchangesByUserId, selectActiveExchangesByUserId, selectCompletedExchangesByUserId)
// перенесены в features/exchanges согласно FSD

export default exchangesReducer
