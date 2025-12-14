import exchangesReducer from './model/exchangesSlice';

// Types
export type { Exchange, ExchangeStatus } from './model/types';
export type { ExchangesState } from './model/exchangesSlice';

// Slice
export {
  default as exchangesReducer,
  initializeExchanges,
  setExchanges,
  addExchange,
  updateExchange,
  deleteExchange,
  setExchangesLoading,
  setExchangesError,
} from './model/exchangesSlice';

// Selectors (from slice) - только базовые селекторы, работающие со своим state
export {
  selectAllExchanges,
  selectExchangeById,
  selectExchangeByRequestId,
  selectExchangesByStatus,
  selectActiveExchanges,
  selectCompletedExchanges,
  selectCancelledExchanges,
  selectExchangesLoading,
  selectExchangesError,
} from './model/exchangesSlice';

// Memoized selectors (только те, что не требуют cross-slice данных)
export { selectExchangesState, selectHasExchangeForRequest } from './model/selectors';

// Cross-slice селекторы (selectExchangesByUserId, selectActiveExchangesByUserId, selectCompletedExchangesByUserId)
// перенесены в features/exchanges согласно FSD

export default exchangesReducer;
