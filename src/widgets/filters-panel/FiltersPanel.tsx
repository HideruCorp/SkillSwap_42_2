import { SkillsFilter } from '@features/filters/skillsFilter';
import { CityFilter } from '@features/filters/cityFilter';
import { RadioGroupUI } from '@shared/ui/radiogroup';
import { useMemo, useState } from 'react';
import type { TSkillType, Gender } from '@shared/types';
import CrossIcon from '@shared/assets/img/cross.svg?react';
import styles from './filters-panel.module.scss';

function FiltersPanel() {
  // State для фильтров ( NOTE: временно, связать с filterSlice как только появится стор )
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [skillType, setSkillType] = useState<TSkillType>('all');
  const [gender, setGender] = useState<Gender>('all');

  const skillTypeOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Хочу научиться', value: 'learn' },
    { label: 'Хочу научить', value: 'teach' },
  ];

  const genderOptions = [
    { label: 'Не имеет значения', value: 'all' },
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ];

  const handleSkillTypeChange = (value: string) => {
    setSkillType(value as TSkillType);
  };

  const handleGenderChange = (value: string) => {
    setGender(value as Gender);
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSkills.length > 0) count += selectedSkills.length;
    if (selectedCities.length > 0) count += selectedCities.length;
    if (skillType !== 'all') count += 1;
    if (gender !== 'all') count += 1;
    return count;
  }, [selectedSkills, selectedCities, skillType, gender]);

  // Reset all filters to default values
  const handleResetFilters = () => {
    setSelectedSkills([]);
    setSelectedCities([]);
    setSkillType('all');
    setGender('all');
  };

  return (
    <aside className={styles.filters}>
      <div className={styles['filters__header-row']}>
        <h2 className={styles.filters__header}>
          Фильтры{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className={styles['filters__reset-btn']}
            onClick={handleResetFilters}
          >
            Сбросить
            <CrossIcon className={styles['filters__reset-icon']} />
          </button>
        )}
      </div>
      <div className={styles.filters__content}>
        <RadioGroupUI
          name="skillType"
          options={skillTypeOptions}
          value={skillType}
          onChange={handleSkillTypeChange}
        />
        <SkillsFilter selectedSkills={selectedSkills} onSelectionChange={setSelectedSkills} />
        <section className={styles.filters__section}>
          <h3 className={styles.filters__subheader}>Пол автора</h3>
          <RadioGroupUI
            name="gender"
            options={genderOptions}
            value={gender}
            onChange={handleGenderChange}
          />
        </section>
        <CityFilter selectedCities={selectedCities} onSelectionChange={setSelectedCities} />
      </div>
    </aside>
  );
}

export default FiltersPanel;
