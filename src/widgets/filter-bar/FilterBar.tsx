import type { Category, City, Gender, Subcategory, TSkillType } from '@shared/types'

import categoryApi from '@entities/category/api/categoriesApi'
import cityApi from '@entities/city/api/citiesApi'
import { useActiveFilters } from '@features/filters/useActiveFilters'
import FilterItem from '@shared/ui/filter-item/FilterItem'

import { useEffect, useMemo, useState } from 'react'

import styles from './filter-bar.module.scss'

const SKILL_TYPE_LABELS: Record<TSkillType, string> = {
  all: 'Все',
  learn: 'Хочу научиться',
  teach: 'Могу научить',
}

const GENDER_LABELS: Record<Gender, string> = {
  all: 'Не имеет значения',
  male: 'Мужской',
  female: 'Женский',
}

function FilterBar() {
  const {
    hasActiveFilters,
    skillType,
    gender,
    cities: selectedCities,
    subcategories: selectedSubcategories,
    textSearch,
    handleRemoveSkillType,
    handleRemoveGender,
    handleRemoveCity,
    handleRemoveSubcategory,
    handleRemoveTextSearch,
    handleSetSubcategories,
  } = useActiveFilters()

  const [categoriesData, setCategoriesData] = useState<{
    categories: Category[]
    subcategories: Subcategory[]
  } | null>(null)
  const [, setCitiesData] = useState<City[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, citiesRes] = await Promise.all([
          categoryApi.getAll(),
          cityApi.getCities(),
        ])
        setCategoriesData({
          categories: categoriesRes.categories,
          subcategories: categoriesRes.subcategories,
        })
        setCitiesData(citiesRes)
      } catch (error) {
        console.error('Error loading filter data:', error)
      }
    }

    loadData()
  }, [])

  const handleRemoveCategory = (categoryId: number) => {
    if (!categoriesData?.subcategories)
      return

    const subcategoryIds = categoriesData.subcategories
      .filter((sub) => sub.categoryId === categoryId)
      .map((sub) => sub.id)

    const newSelection = selectedSubcategories.filter((id) => !subcategoryIds.includes(id))
    handleSetSubcategories(newSelection)
  }

  const groupedSubcategories = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return new Map<number, number[]>()
    }

    const map = new Map<number, number[]>()

    selectedSubcategories.forEach((subcategoryId) => {
      const subcategory = categoriesData.subcategories.find((sub) => sub.id === subcategoryId)
      if (subcategory) {
        const { categoryId } = subcategory
        const subIds = map.get(categoryId) || []
        subIds.push(subcategoryId)
        map.set(categoryId, subIds)
      }
    })

    return map
  }, [selectedSubcategories, categoriesData])

  const areAllSubcategoriesSelected = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return new Map<number, boolean>()
    }

    const result = new Map<number, boolean>()

    categoriesData.categories.forEach((category) => {
      const allSubcategories = categoriesData.subcategories.filter(
        (sub) => sub.categoryId === category.id,
      )
      const selectedSubcategories = groupedSubcategories.get(category.id) || []

      result.set(
        category.id,
        allSubcategories.length > 0 && allSubcategories.length === selectedSubcategories.length,
      )
    })

    return result
  }, [groupedSubcategories, categoriesData])

  const filterItems = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return []
    }

    const items: Array<{
      type: 'category' | 'subcategory'
      id: number
      name: string
      onClick: () => void
    }> = []
    const processedCategories = new Set<number>()

    const getCategoryNameLocal = (categoryId: number): string => {
      const category = categoriesData.categories.find(
        (cat: Category) => cat && cat.id === categoryId,
      )
      return category?.name || `Категория ${categoryId}`
    }

    const getSubcategoryNameLocal = (id: number): string => {
      const subcategory = categoriesData.subcategories.find((sc) => sc && sc.id === id)
      return subcategory?.name || `Подкатегория ${id}`
    }

    selectedSubcategories.forEach((subcategoryId) => {
      const subcategory = categoriesData.subcategories.find((sub) => sub.id === subcategoryId)
      if (!subcategory)
        return

      const { categoryId } = subcategory

      if (processedCategories.has(categoryId))
        return

      const allSelected = areAllSubcategoriesSelected.get(categoryId) || false

      if (allSelected) {
        items.push({
          type: 'category',
          id: categoryId,
          name: getCategoryNameLocal(categoryId),
          onClick: () => handleRemoveCategory(categoryId),
        })
        processedCategories.add(categoryId)
      } else {
        items.push({
          type: 'subcategory',
          id: subcategoryId,
          name: getSubcategoryNameLocal(subcategoryId),
          onClick: () => handleRemoveSubcategory(subcategoryId),
        })
      }
    })

    return items
  }, [
    selectedSubcategories,
    categoriesData,
    areAllSubcategoriesSelected,
    handleRemoveSubcategory,
    handleRemoveCategory,
  ])

  // Если нет активных фильтров для отображения, не рендерим компонент
  if (!hasActiveFilters) {
    return null
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

      {categoriesData
        && filterItems.map((item) => (
          <FilterItem
            key={`${item.type}-${item.id}`}
            type="category"
            value={item.name}
            onClick={item.onClick}
          />
        ))}

      {textSearch.trim() !== '' && (
        <FilterItem type="name" value={textSearch} onClick={handleRemoveTextSearch} />
      )}
    </div>
  )
}

export default FilterBar
