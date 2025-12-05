import { useEffect, useState } from 'react';

import { fetchCategories } from '@api/categoriesApi';
import { fetchCities } from '@api/citiesApi';
import type { Subcategory, City, TSkillType, Gender } from '@shared/types';
import FilterItem from '@shared/ui/filter-item/FilterItem';

import { useDispatch, useSelector } from '../../services/store';
import {
  filtersSlice,
  setSkillType,
  setGender,
  setCities,
  setSubcategories,
  setTextSearch,
} from '../../services/slices/filtersSlice';

import styles from './filter-bar.module.scss';

const { selectSkillType, selectGender, selectCities, selectSubcategories, selectTextSearch } =
  filtersSlice.selectors;

const SKILL_TYPE_LABELS: Record<TSkillType, string> = {
  all: 'Все',
  learn: 'Хочу научиться',
  teach: 'Могу научить',
};

const GENDER_LABELS: Record<Gender, string> = {
  all: 'Не имеет значения',
  male: 'Мужской',
  female: 'Женский',
};

function FilterBar() {
  const dispatch = useDispatch();

  const skillType = useSelector(selectSkillType);
  const gender = useSelector(selectGender);
  const selectedCities = useSelector(selectCities);
  const selectedSubcategories = useSelector(selectSubcategories);
  const textSearch = useSelector(selectTextSearch);

  const [subcategoriesData, setSubcategoriesData] = useState<Subcategory[]>([]);
  const [, setCitiesData] = useState<City[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, citiesRes] = await Promise.all([fetchCategories(), fetchCities()]);
        setSubcategoriesData(categoriesRes.subcategories);
        setCitiesData(citiesRes);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading filter data:', error);
      }
    };

    loadData();
  }, []);

  const handleRemoveSkillType = () => {
    dispatch(setSkillType('all'));
  };

  const handleRemoveGender = () => {
    dispatch(setGender('all'));
  };

  const handleRemoveCity = (cityName: string) => {
    dispatch(setCities(selectedCities.filter((c: string) => c !== cityName)));
  };

  const handleRemoveSubcategory = (subcategoryId: number) => {
    dispatch(setSubcategories(selectedSubcategories.filter((id: number) => id !== subcategoryId)));
  };

  const handleRemoveTextSearch = () => {
    dispatch(setTextSearch(''));
  };

  const getSubcategoryName = (id: number): string => {
    const subcategory = subcategoriesData.find((sc) => sc.id === id);
    return subcategory?.name ?? `Категория ${id}`;
  };

  const hasActiveFilters =
    skillType !== 'all' ||
    gender !== 'all' ||
    selectedCities.length > 0 ||
    selectedSubcategories.length > 0 ||
    textSearch !== '';

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className={styles['filter-bar']}>
      {skillType !== 'all' && (
        <FilterItem
          type="searchType"
          value={SKILL_TYPE_LABELS[skillType]}
          onClick={handleRemoveSkillType}
        />
      )}

      {gender !== 'all' && (
        <FilterItem type="gender" value={GENDER_LABELS[gender]} onClick={handleRemoveGender} />
      )}

      {selectedCities.map((cityName: string) => (
        <FilterItem
          key={cityName}
          type="city"
          value={cityName}
          onClick={() => handleRemoveCity(cityName)}
        />
      ))}

      {selectedSubcategories.map((subcategoryId: number) => (
        <FilterItem
          key={subcategoryId}
          type="category"
          value={getSubcategoryName(subcategoryId)}
          onClick={() => handleRemoveSubcategory(subcategoryId)}
        />
      ))}

      {textSearch !== '' && (
        <FilterItem type="name" value={textSearch} onClick={handleRemoveTextSearch} />
      )}
    </div>
  );
}

export default FilterBar;
