import { SkillsFilter } from '@features/filters/skillsFilter';
import { CityFilter } from '@features/filters/cityFilter';
import { RadioGroupUI } from '@shared/ui/radiogroup';
import { useState } from 'react';
import type { TSkillType, Gender } from '@shared/types';
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

  return (
    <aside className={styles.filters}>
      <h2 className={styles.filters__header}>Фильтры</h2>
      <div className={styles.filters__content}>
        <RadioGroupUI
          name="skillType"
          options={skillTypeOptions}
          value={skillType}
          onChange={handleSkillTypeChange}
        />
        <SkillsFilter selectedSkills={selectedSkills} onSelectionChange={setSelectedSkills} />
        <RadioGroupUI
          name="gender"
          options={genderOptions}
          value={gender}
          onChange={handleGenderChange}
        />
        <CityFilter selectedCities={selectedCities} onSelectionChange={setSelectedCities} />
      </div>
    </aside>
  );
}

export default FiltersPanel;
