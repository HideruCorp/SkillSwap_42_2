import DeltaStorage from '@shared/lib/storage/deltaStorage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Exchange, Nullable } from '@shared/types';

export interface ExchangesState {
  items: Exchange[];
  isLoading: boolean;
  error: Nullable<string>;
}

const initialState: ExchangesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const initializeExchanges = createAsyncThunk('exchanges/initialize', async () => {
  const exchanges = await DeltaStorage.getAllExchanges();
  return exchanges;
});

const exchangesSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {
    setExchanges(state, action: PayloadAction<Exchange[]>) {
      state.items = action.payload;
    },
    addExchange(state, action: PayloadAction<Exchange>) {
      state.items.push(action.payload);
    },
    updateExchange(state, action: PayloadAction<{ id: number; changes: Partial<Exchange> }>) {
      const index = state.items.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteExchange(state, action: PayloadAction<number>) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    setExchangesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setExchangesError(state, action: PayloadAction<Nullable<string>>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeExchanges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeExchanges.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeExchanges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load exchanges';
      });
  },
  selectors: {
    selectAllExchanges: (state) => state.items,
    selectExchangeById: (state, id: number) => state.items.find((e) => e.id === id),
    selectExchangeByRequestId: (state, requestId: number) =>
      state.items.find((e) => e.requestId === requestId),
    selectExchangesByStatus: (state, status: Exchange['status']) =>
      state.items.filter((e) => e.status === status),
    selectActiveExchanges: (state) => state.items.filter((e) => e.status === 'inProgress'),
    selectCompletedExchanges: (state) => state.items.filter((e) => e.status === 'completed'),
    selectCancelledExchanges: (state) => state.items.filter((e) => e.status === 'cancelled'),
    selectExchangesLoading: (state) => state.isLoading,
    selectExchangesError: (state) => state.error,
  },
});

export const {
  setExchanges,
  addExchange,
  updateExchange,
  deleteExchange,
  setExchangesLoading,
  setExchangesError,
} = exchangesSlice.actions;

export const {
  selectAllExchanges,
  selectExchangeById,
  selectExchangeByRequestId,
  selectExchangesByStatus,
  selectActiveExchanges,
  selectCompletedExchanges,
  selectCancelledExchanges,
  selectExchangesLoading,
  selectExchangesError,
} = exchangesSlice.selectors;

export default exchangesSlice.reducer;
