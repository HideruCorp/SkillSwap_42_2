import DeltaStorage from '@shared/lib/storage/deltaStorage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Request, Nullable } from '@shared/types';

export interface RequestsState {
  items: Request[];
  isLoading: boolean;
  error: Nullable<string>;
}

const initialState: RequestsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const initializeRequests = createAsyncThunk('requests/initialize', async () => {
  const requests = await DeltaStorage.getAllRequests();
  return requests;
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<Request[]>) {
      state.items = action.payload;
    },
    addRequest(state, action: PayloadAction<Request>) {
      state.items.push(action.payload);
    },
    updateRequest(state, action: PayloadAction<{ id: number; changes: Partial<Request> }>) {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteRequest(state, action: PayloadAction<number>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
    setRequestsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setRequestsError(state, action: PayloadAction<Nullable<string>>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeRequests.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load requests';
      });
  },
  selectors: {
    selectAllRequests: (state) => state.items,
    selectRequestById: (state, id: number) => state.items.find((r) => r.id === id),
    selectRequestsByFromUser: (state, userId: number) =>
      state.items.filter((r) => r.fromUser === userId),
    selectRequestsByStatus: (state, status: Request['status']) =>
      state.items.filter((r) => r.status === status),
    selectPendingRequests: (state) => state.items.filter((r) => r.status === 'pending'),
    selectRequestsLoading: (state) => state.isLoading,
    selectRequestsError: (state) => state.error,
  },
});

export const {
  setRequests,
  addRequest,
  updateRequest,
  deleteRequest,
  setRequestsLoading,
  setRequestsError,
} = requestsSlice.actions;

export const {
  selectAllRequests,
  selectRequestById,
  selectRequestsByFromUser,
  selectRequestsByStatus,
  selectPendingRequests,
  selectRequestsLoading,
  selectRequestsError,
} = requestsSlice.selectors;

export default requestsSlice.reducer;
