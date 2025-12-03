import { filtersSlice } from '../filtersSlice';

export const {
  selectSkillType,
  selectGender,
  selectCities,
  selectSubcategories,
  selectTextSearch
} = filtersSlice.selectors;