import requestsReducer from './model/requestsSlice'

export type { RequestsState } from './model/requestsSlice'
// Slice
export {
  addRequest,
  deleteRequest,
  initializeRequests,
  default as requestsReducer,
  setRequests,
  setRequestsError,
  setRequestsLoading,
  updateRequest,
} from './model/requestsSlice'

// Selectors (from slice) - только базовые селекторы, работающие со своим state
export {
  selectAllRequests,
  selectPendingRequests,
  selectRequestById,
  selectRequestsByFromUser,
  selectRequestsByStatus,
  selectRequestsError,
  selectRequestsLoading,
} from './model/requestsSlice'

// Memoized selectors (только те, что не требуют cross-slice данных)
export {
  selectAcceptedRequests,
  selectOutgoingPendingRequests,
  selectOutgoingRequests,
  selectRejectedRequests,
  selectRequestsState,
} from './model/selectors'

// Types
export type { Request, RequestStatus } from './model/types'

// Cross-slice селекторы (selectIncomingRequests, selectIncomingPendingRequests)
// перенесены в features/requests согласно FSD

export default requestsReducer
