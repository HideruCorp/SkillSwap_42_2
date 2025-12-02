import React, { useState, useMemo } from 'react';
import styles from '../cityFilter/city-filter.module.scss';
import { CheckboxUI } from '@shared/ui/checkbox/CheckboxUI';
import ChevronUp from '@shared/assets/img/chevron-Up.svg?react';
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react';
import citiesData from '../../../../public/db/city.json';
import type { ICity, CityFilterProps } from './type';

export const CityFilter: React.FC<CityFilterProps> = ({
  selectedCities,
  onSelectionChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const cityNames = useMemo(() => 
    citiesData.cities.map((city: ICity) => city.name), 
    []
  );

  const visibleCities = expanded ? cityNames : cityNames.slice(0, 5);

  const toggleCitySelection = (cityName: string) => {
    const updatedSelection = selectedCities.includes(cityName)
      ? selectedCities.filter(name => name !== cityName)
      : [...selectedCities, cityName];
    onSelectionChange(updatedSelection);
  };

  return (
    <section className={styles.filterContainer}>
      <h2 className={styles.sectionTitle}>Город</h2>
      <ul className={styles.citiesList}>
        {visibleCities.map(city => (
          <li key={city} className={styles.cityItem}>
            <CheckboxUI
              variant="default"
              text={city}
              checked={selectedCities.includes(city)}
              onToggle={() => toggleCitySelection(city)}
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.toggleVisibility}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className={styles.buttonLabel}>
          {expanded ? 'Свернуть' : 'Все города'}
        </span>
        {expanded ? (
          <ChevronUp className={styles.arrowIcon} />
        ) : (
          <ChevronDown className={styles.arrowIcon} />
        )}
      </button>
    </section>
  );
};

export default CityFilter;