import sortReducer from './model/sortSlice';

// Re-export everything from model
export { sortSlice, setSortBy, resetSort } from './model/sortSlice';
export type { SortOption } from './model/sortSlice';

// Default export for reducer
export default sortReducer;
