import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Gender, TSkillType } from '@shared/types/index';

type TFiltersState = {
  skillType: TSkillType;
  gender: Gender;
  cities: string[];
  subcategories: number[];
  textSearch: string;
};

const initialState: TFiltersState = {
  skillType: 'all',
  gender: 'all',
  cities: [],
  subcategories: [],
  textSearch: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSkillType: (state, action: PayloadAction<TSkillType>) => {
      state.skillType = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
    setCities: (state, action: PayloadAction<string[]>) => {
      state.cities = action.payload;
    },
    setSubcategories: (state, action: PayloadAction<number[]>) => {
      state.subcategories = action.payload;
    },
    setTextSearch: (state, action: PayloadAction<string>) => {
      state.textSearch = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
  selectors: {
    selectSkillType: (state) => state.skillType,
    selectGender: (state) => state.gender,
    selectCities: (state) => state.cities,
    selectSubcategories: (state) => state.subcategories,
    selectTextSearch: (state) => state.textSearch,
  },
});

export const { setSkillType, setGender, setCities, setSubcategories, setTextSearch, resetFilters } =
  filtersSlice.actions;

export const {
  selectSkillType,
  selectGender,
  selectCities,
  selectSubcategories,
  selectTextSearch,
} = filtersSlice.selectors;

export default filtersSlice.reducer;
