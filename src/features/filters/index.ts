import filtersReducer from './model/filtersSlice';

// Re-export everything from model
export {
  filtersSlice,
  selectSkillType,
  setSkillType,
  selectGender,
  setGender,
  selectCities,
  setCities,
  selectSubcategories,
  setSubcategories,
  selectTextSearch,
  setTextSearch,
  resetFilters,
} from './model/filtersSlice';

export { useActiveFilters } from './useActiveFilters';
export type { default as FiltersState } from './model/filtersSlice';

// Default export for reducer
export default filtersReducer;
