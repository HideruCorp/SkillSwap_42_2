import requestsReducer from './model/requestsSlice';

// Types
export type { Request, RequestStatus } from './model/types';
export type { RequestsState } from './model/types';

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

// Selectors (from slice)
export {
  selectAllRequests,
  selectRequestById,
  selectRequestsByFromUser,
  selectRequestsByStatus,
  selectPendingRequests,
  selectRequestsLoading,
  selectRequestsError,
} from './model/requestsSlice';

// Memoized selectors (from separate file)
export {
  selectRequestsState,
  selectOutgoingRequests,
  selectIncomingRequests,
  selectAcceptedRequests,
  selectRejectedRequests,
  selectIncomingPendingRequests,
  selectOutgoingPendingRequests,
} from './model/selectors';

export default requestsReducer;
