import React, { useState, useMemo, useEffect } from 'react';
import styles from './city-filter.module.scss';
import { CheckboxUI } from '@shared/ui/checkbox/CheckboxUI';
import ChevronUp from '@shared/assets/img/chevron-Up.svg?react';
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react';
import type { ICity, CityFilterProps } from './type';

export const CityFilter: React.FC<CityFilterProps> = ({
  selectedCities,
  onSelectionChange,
}) => {
  const [citiesData, setCitiesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetch('/db/city.json')
      .then((res) => res.json())
      .then((data) => {
        setCitiesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки city.json:', err);
        setLoading(false);
      });
  }, []);

  const cityNames = useMemo(
    () => {
      if (!citiesData) return [];
      return citiesData.cities.map((city: ICity) => city.name);
    },
    [citiesData]
  );

  const visibleCities = expanded ? cityNames : cityNames.slice(0, 5);

  const toggleCitySelection = (cityName: string) => {
    const updatedSelection = selectedCities.includes(cityName)
      ? selectedCities.filter((name) => name !== cityName)
      : [...selectedCities, cityName];
    onSelectionChange(updatedSelection);
  };

  // Показать loader пока данные загружаются
  if (loading || !citiesData) {
    return (
      <section className={styles.filterContainer}>
        <h2 className={styles.sectionTitle}>Город</h2>
        <p>Загрузка...</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className={styles.filterHeading}>Город</h2>
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