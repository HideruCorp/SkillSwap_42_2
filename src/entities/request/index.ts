import requestsReducer from './model/requestsSlice';

// Types
export type { Request, RequestStatus } from './model/types';
export type { RequestsState } from './model/requestsSlice';

// Slice
export {
  default as requestsReducer,
  initializeRequests,
  setRequests,
  addRequest,
  updateRequest,
  deleteRequest,
  setRequestsLoading,
  setRequestsError,
} from './model/requestsSlice';

// Selectors (from slice) - только базовые селекторы, работающие со своим state
export {
  selectAllRequests,
  selectRequestById,
  selectRequestsByFromUser,
  selectRequestsByStatus,
  selectPendingRequests,
  selectRequestsLoading,
  selectRequestsError,
} from './model/requestsSlice';

// Memoized selectors (только те, что не требуют cross-slice данных)
export {
  selectRequestsState,
  selectOutgoingRequests,
  selectAcceptedRequests,
  selectRejectedRequests,
  selectOutgoingPendingRequests,
} from './model/selectors';

// Cross-slice селекторы (selectIncomingRequests, selectIncomingPendingRequests)
// перенесены в features/requests согласно FSD

export default requestsReducer;
