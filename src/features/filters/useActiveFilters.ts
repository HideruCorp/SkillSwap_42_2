import { useDispatch, useSelector } from '@app/store'
import { useCallback, useMemo } from 'react'
import {
  setCities,
  setGender,
  setSkillType,
  setSubcategories,
  setTextSearch,
} from './model/filtersSlice'

export function useActiveFilters() {
  const dispatch = useDispatch()

  const skillType = useSelector((state) => state.filters.skillType)
  const gender = useSelector((state) => state.filters.gender)
  const cities = useSelector((state) => state.filters.cities)
  const subcategories = useSelector((state) => state.filters.subcategories)
  const textSearch = useSelector((state) => state.filters.textSearch)

  const hasActiveFilters = useMemo(() => {
    return (
      skillType !== 'all'
      || gender !== 'all'
      || (cities && cities.length > 0)
      || (subcategories && subcategories.length > 0)
      || (textSearch && textSearch.trim() !== '')
    )
  }, [skillType, gender, cities, subcategories, textSearch])

  // Обработчики удаления фильтров
  const handleRemoveSkillType = useCallback(() => {
    dispatch(setSkillType('all'))
  }, [dispatch])

  const handleRemoveGender = useCallback(() => {
    dispatch(setGender('all'))
  }, [dispatch])

  const handleRemoveCity = useCallback(
    (cityName: string) => {
      dispatch(setCities(cities.filter((c: string) => c !== cityName)))
    },
    [dispatch, cities],
  )

  const handleRemoveSubcategory = useCallback(
    (subcategoryId: number) => {
      dispatch(setSubcategories(subcategories.filter((id: number) => id !== subcategoryId)))
    },
    [dispatch, subcategories],
  )

  const handleRemoveTextSearch = useCallback(() => {
    dispatch(setTextSearch(''))
  }, [dispatch])

  const handleSetSubcategories = useCallback(
    (newSubcategories: number[]) => {
      dispatch(setSubcategories(newSubcategories))
    },
    [dispatch],
  )

  return {
    // Данные фильтров
    skillType,
    gender,
    cities,
    subcategories,
    textSearch,

    // Флаг активных фильтров
    hasActiveFilters,

    // Обработчики удаления
    handleRemoveSkillType,
    handleRemoveGender,
    handleRemoveCity,
    handleRemoveSubcategory,
    handleRemoveTextSearch,
    handleSetSubcategories,
  }
}
