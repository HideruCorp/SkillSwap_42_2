import { useMemo } from 'react';
import { SkillsFilter } from '@features/filters/skillsFilter';
import { CityFilter } from '@features/filters/cityFilter';
import { RadioGroupUI } from '@shared/ui/radiogroup';
import type { TSkillType, Gender } from '@shared/types';
import CrossIcon from '@shared/assets/img/cross.svg?react';

import { useDispatch, useSelector } from '../../services/store';
import {
  setSkillType,
  setGender,
  setCities,
  setSubcategories,
  resetFilters,
  selectSkillType,
  selectGender,
  selectCities,
  selectSubcategories,
} from '../../services/slices/filtersSlice';

import styles from './filters-panel.module.scss';

function FiltersPanel() {
  const dispatch = useDispatch();

  const skillType = useSelector(selectSkillType);
  const gender = useSelector(selectGender);
  const selectedCities = useSelector(selectCities);
  const selectedSubcategories = useSelector(selectSubcategories);

  const skillTypeOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Хочу научиться', value: 'learn' },
    { label: 'Могу научить', value: 'teach' },
  ];

  const genderOptions = [
    { label: 'Не имеет значения', value: 'all' },
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ];

  const handleSkillTypeChange = (value: string) => {
    dispatch(setSkillType(value as TSkillType));
  };

  const handleGenderChange = (value: string) => {
    dispatch(setGender(value as Gender));
  };

  const handleSkillsChange = (ids: number[]) => {
    dispatch(setSubcategories(ids));
  };

  const handleCitiesChange = (cities: string[]) => {
    dispatch(setCities(cities));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubcategories.length > 0) count += selectedSubcategories.length;
    if (selectedCities.length > 0) count += selectedCities.length;
    if (skillType !== 'all') count += 1;
    if (gender !== 'all') count += 1;
    return count;
  }, [selectedSubcategories, selectedCities, skillType, gender]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <aside className={styles.filters}>
      <div className={styles['filters__header-row']}>
        <h2 className={styles.filters__header}>
          Фильтры
          <span
            className={`${styles.filters__counter} ${hasActiveFilters ? styles['filters__counter--visible'] : ''}`}
          >
            {` (${activeFiltersCount})`}
          </span>
        </h2>
        <button
          type="button"
          className={`${styles['filters__reset-btn']} ${hasActiveFilters ? styles['filters__reset-btn--visible'] : ''}`}
          onClick={handleResetFilters}
          aria-hidden={!hasActiveFilters}
          tabIndex={hasActiveFilters ? 0 : -1}
        >
          Сбросить
          <CrossIcon className={styles['filters__reset-icon']} />
        </button>
      </div>
      <div className={styles.filters__content}>
        <RadioGroupUI
          name="skillType"
          options={skillTypeOptions}
          value={skillType}
          onChange={handleSkillTypeChange}
        />

        <SkillsFilter
          selectedSkills={selectedSubcategories}
          onSelectionChange={handleSkillsChange}
        />

        <section className={styles.filters__section}>
          <h3 className={styles.filters__subheader}>Пол автора</h3>
          <RadioGroupUI
            name="gender"
            options={genderOptions}
            value={gender}
            onChange={handleGenderChange}
          />
        </section>

        <CityFilter selectedCities={selectedCities} onSelectionChange={handleCitiesChange} />
      </div>
    </aside>
  );
}

export default FiltersPanel;
