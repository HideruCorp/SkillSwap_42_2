import type { CityFilterProps, ICity } from './type'
import cityApi from '@entities/city/api/citiesApi'
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react'
import ChevronUp from '@shared/assets/img/chevron-Up.svg?react'
import { CheckboxUI } from '@shared/ui/checkbox/CheckboxUI'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './city-filter.module.scss'

export function CityFilter({ selectedCities, onSelectionChange }: CityFilterProps) {
  const [cities, setCities] = useState<ICity[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  // Загрузка данных при монтировании
  useEffect(() => {
    cityApi
      .getCities()
      .then((data) => {
        setCities(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка загрузки городов:', err)
        setLoading(false)
      })
  }, [])

  const cityNames = useMemo(() => {
    return cities.map((city) => city.name)
  }, [cities])

  const visibleCities = expanded ? cityNames : cityNames.slice(0, 5)

  const toggleCitySelection = (cityName: string) => {
    const updatedSelection = selectedCities.includes(cityName)
      ? selectedCities.filter((name) => name !== cityName)
      : [...selectedCities, cityName]
    onSelectionChange(updatedSelection)
  }

  // Показать loader пока данные загружаются
  if (loading) {
    return (
      <section className={styles.filterContainer}>
        <h2 className={styles.sectionTitle}>Город</h2>
        <p>Загрузка...</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className={styles.filterHeading}>Город</h2>
      <ul className={styles.citiesList}>
        {visibleCities.map((city) => (
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
        <span className={styles.buttonLabel}>{expanded ? 'Свернуть' : 'Все города'}</span>
        {expanded
          ? (
              <ChevronUp className={styles.arrowIcon} />
            )
          : (
              <ChevronDown className={styles.arrowIcon} />
            )}
      </button>
    </section>
  )
}

export default CityFilter
