import filtersReducer from './model/filtersSlice'

// Re-export everything from model
export {
  filtersSlice,
  resetFilters,
  selectCities,
  selectGender,
  selectSkillType,
  selectSubcategories,
  selectTextSearch,
  setCities,
  setGender,
  setSkillType,
  setSubcategories,
  setTextSearch,
} from './model/filtersSlice'

export type { default as FiltersState } from './model/filtersSlice'
export { useActiveFilters } from './useActiveFilters'

// Default export for reducer
export default filtersReducer
