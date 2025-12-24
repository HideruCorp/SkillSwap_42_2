import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export type SortOption = 'popular' | 'newest' | 'oldest' | 'name' | 'age'

interface TSortState {
  sortBy: SortOption
}

const initialState: TSortState = {
  sortBy: 'popular',
}

export const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload
    },
    resetSort() {
      return initialState
    },
  },
  selectors: {
    selectSortBy: (state) => state.sortBy,
  },
})

export const { setSortBy, resetSort } = sortSlice.actions

export default sortSlice.reducer
