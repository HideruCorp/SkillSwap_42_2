import { useEffect, useState, useMemo } from 'react';

import { fetchCategories } from '@api/categoriesApi';
import { fetchCities } from '@api/citiesApi';
import type { Subcategory, City, TSkillType, Gender, Category } from '@shared/types';
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

  const [categoriesData, setCategoriesData] = useState<{ categories: Category[]; subcategories: Subcategory[] } | null>(null);
  const [, setCitiesData] = useState<City[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, citiesRes] = await Promise.all([fetchCategories(), fetchCities()]);
        // Сохраняем полный объект с categories и subcategories
        setCategoriesData({
          categories: categoriesRes.categories,
          subcategories: categoriesRes.subcategories,
        });
        setCitiesData(citiesRes);
      } catch (error) {
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

  const handleRemoveCategory = (categoryId: number) => {
    if (!categoriesData?.subcategories) return;
    
    // Находим все подкатегории этой категории
    const subcategoryIds = categoriesData.subcategories
      .filter((sub) => sub.categoryId === categoryId)
      .map((sub) => sub.id);
    
    // Удаляем все подкатегории этой категории из выбранных
    const newSelection = selectedSubcategories.filter((id) => !subcategoryIds.includes(id));
    dispatch(setSubcategories(newSelection));
  };

  const handleRemoveTextSearch = () => {
    dispatch(setTextSearch(''));
  };

  // Группируем выбранные подкатегории по категориям
  const groupedSubcategories = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return new Map<number, number[]>();
    }

    const map = new Map<number, number[]>();
    
    // Для каждой выбранной подкатегории находим её категорию
    selectedSubcategories.forEach((subcategoryId) => {
      const subcategory = categoriesData.subcategories.find((sub) => sub.id === subcategoryId);
      if (subcategory) {
        const categoryId = subcategory.categoryId;
        const subIds = map.get(categoryId) || [];
        subIds.push(subcategoryId);
        map.set(categoryId, subIds);
      }
    });

    return map;
  }, [selectedSubcategories, categoriesData]);

  // Проверяем, все ли подкатегории категории выбраны
  const areAllSubcategoriesSelected = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return new Map<number, boolean>();
    }

    const result = new Map<number, boolean>();

    categoriesData.categories.forEach((category) => {
      const allSubcategories = categoriesData.subcategories.filter(
        (sub) => sub.categoryId === category.id
      );
      const selectedSubcategories = groupedSubcategories.get(category.id) || [];
      
      // Все подкатегории выбраны, если их количество совпадает
      result.set(category.id, allSubcategories.length > 0 && 
        allSubcategories.length === selectedSubcategories.length);
    });

    return result;
  }, [groupedSubcategories, categoriesData]);

  // Формируем список элементов для отображения
  const filterItems = useMemo(() => {
    if (!categoriesData?.subcategories || !categoriesData?.categories) {
      return [];
    }

    const items: Array<{ type: 'category' | 'subcategory'; id: number; name: string; onClick: () => void }> = [];
    const processedCategories = new Set<number>();

    // Вспомогательные функции для получения имен
    const getCategoryNameLocal = (categoryId: number): string => {
      const category = categoriesData.categories.find((cat: Category) => cat && cat.id === categoryId);
      return category?.name || `Категория ${categoryId}`;
    };

    const getSubcategoryNameLocal = (id: number): string => {
      const subcategory = categoriesData.subcategories.find((sc) => sc && sc.id === id);
      return subcategory?.name || `Подкатегория ${id}`;
    };

    // Обрабатываем выбранные подкатегории
    selectedSubcategories.forEach((subcategoryId) => {
      const subcategory = categoriesData.subcategories.find((sub) => sub.id === subcategoryId);
      if (!subcategory) return;

      const categoryId = subcategory.categoryId;
      
      // Если категория уже обработана (все подкатегории выбраны), пропускаем
      if (processedCategories.has(categoryId)) return;

      const allSelected = areAllSubcategoriesSelected.get(categoryId) || false;

      if (allSelected) {
        // Если все подкатегории категории выбраны, добавляем категорию
        items.push({
          type: 'category',
          id: categoryId,
          name: getCategoryNameLocal(categoryId),
          onClick: () => handleRemoveCategory(categoryId),
        });
        processedCategories.add(categoryId);
      } else {
        // Если не все выбраны, добавляем отдельную подкатегорию
        items.push({
          type: 'subcategory',
          id: subcategoryId,
          name: getSubcategoryNameLocal(subcategoryId),
          onClick: () => handleRemoveSubcategory(subcategoryId),
        });
      }
    });

    return items;
  }, [selectedSubcategories, categoriesData, areAllSubcategoriesSelected]);

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

      {filterItems.map((item) => (
        <FilterItem
          key={`${item.type}-${item.id}`}
          type="category"
          value={item.name}
          onClick={item.onClick}
        />
      ))}

      {textSearch !== '' && (
        <FilterItem type="name" value={textSearch} onClick={handleRemoveTextSearch} />
      )}
    </div>
  );
}

export default FilterBar;
