import exchangesReducer from './model/exchangesSlice';

// Types
export type { Exchange, ExchangeStatus } from './model/types';
export type { ExchangesState } from './model/types';

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

// Selectors (from slice)
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

// Memoized selectors (from separate file)
export {
  selectExchangesState,
  selectExchangesByUserId,
  selectActiveExchangesByUserId,
  selectCompletedExchangesByUserId,
  selectHasExchangeForRequest,
} from './model/selectors';

export default exchangesReducer;
