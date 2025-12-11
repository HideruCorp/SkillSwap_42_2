import React, { useState, useMemo, useEffect } from 'react';
import { CheckboxUI } from '@shared/ui/checkbox/CheckboxUI';
import ChevronUp from '@shared/assets/img/chevron-Up.svg?react';
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react';
import styles from './skills-filter.module.scss';
import type { SkillsFilterProps } from './types';

interface CategoryItem {
  id: number;
  name: string;
}

interface SubcategoryItem {
  id: number;
  name: string;
  categoryId: number;
}

interface CategoryData {
  categories: CategoryItem[];
  subcategories: SubcategoryItem[];
}

interface DisplayItem {
  id: number;
  name: string;
  isCategory: boolean;
  isSubcategory?: boolean;
  parentId?: number;
  hasSubcategories?: boolean;
}

function SkillsFilter({ selectedSkills, onSelectionChange }: SkillsFilterProps) {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/db/category.json')
      .then((res) => res.json())
      .then((data: CategoryData) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const subcategoriesByCategory = useMemo(() => {
    if (!categoryData) return new Map<number, SubcategoryItem[]>();

    const map = new Map<number, SubcategoryItem[]>();
    categoryData.subcategories.forEach((sub) => {
      const subs = map.get(sub.categoryId) || [];
      subs.push(sub);
      map.set(sub.categoryId, subs);
    });
    return map;
  }, [categoryData]);

  const displayItems = useMemo(() => {
    if (!categoryData) return [];

    const items: DisplayItem[] = [];

    categoryData.categories.forEach((category) => {
      const subcategories = subcategoriesByCategory.get(category.id) || [];
      const hasSubs = subcategories.length > 0;

      items.push({
        id: category.id,
        name: category.name,
        isCategory: true,
        hasSubcategories: hasSubs,
      });

      const shouldShowSubcategories = expanded || expandedCategories.has(category.id);
      if (shouldShowSubcategories && hasSubs) {
        subcategories.forEach((sub) => {
          items.push({
            id: sub.id,
            name: sub.name,
            isCategory: false,
            isSubcategory: true,
            parentId: category.id,
          });
        });
      }
    });

    return items;
  }, [categoryData, expanded, expandedCategories, subcategoriesByCategory]);

  const getSubcategoryIds = (categoryId: number): number[] => {
    const subs = subcategoriesByCategory.get(categoryId) || [];
    return subs.map((sub) => sub.id);
  };

  const areAllSubcategoriesSelected = (categoryId: number): boolean => {
    const subIds = getSubcategoryIds(categoryId);
    if (subIds.length === 0) return false;
    return subIds.every((id) => selectedSkills.includes(id));
  };

  const isAnySubcategorySelected = (categoryId: number): boolean => {
    const subIds = getSubcategoryIds(categoryId);
    return subIds.some((id) => selectedSkills.includes(id));
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSkillSelection = (skillId: number) => {
    const updatedSelection = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId];
    onSelectionChange(updatedSelection);
  };

  const handleCategoryToggle = (categoryId: number) => {
    const subIds = getSubcategoryIds(categoryId);
    const allSelected = areAllSubcategoriesSelected(categoryId);

    if (allSelected) {
      const newSelection = selectedSkills.filter((id) => !subIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      const newSelection = [...selectedSkills];
      subIds.forEach((id) => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      onSelectionChange(newSelection);
    }
  };

  const handleToggleAll = () => {
    setExpanded(!expanded);
  };

  if (loading || !categoryData) {
    return (
      <section>
        <h2 className={styles.sectionTitle}>Навыки</h2>
        <p>Загрузка...</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>Навыки</h2>
      <ul className={styles.skillsList}>
        {displayItems.map((item) => {
          if (item.isCategory && item.hasSubcategories) {
            const anySelected = isAnySubcategorySelected(item.id);
            const allSelected = areAllSubcategoriesSelected(item.id);
            const isExpanded = expanded || expandedCategories.has(item.id);

            return (
              <li key={`category-${item.id}`} className={styles.skillItem}>
                <div className={styles.categoryWithArrow}>
                  <CheckboxUI
                    variant={anySelected ? 'remove' : 'default'}
                    text={item.name}
                    checked={allSelected}
                    onToggle={() => handleCategoryToggle(item.id)}
                  />
                  <button
                    type="button"
                    className={styles.toggleSubcategories}
                    onClick={() => toggleCategoryExpansion(item.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronUp className={styles.arrowIcon} />
                    ) : (
                      <ChevronDown className={styles.arrowIcon} />
                    )}
                  </button>
                </div>
              </li>
            );
          }

          if (item.isSubcategory) {
            return (
              <li
                key={`subcategory-${item.id}`}
                className={styles.skillItem}
                style={{ marginLeft: '32px' }}
              >
                <CheckboxUI
                  variant="default"
                  text={item.name}
                  checked={selectedSkills.includes(item.id)}
                  onToggle={() => toggleSkillSelection(item.id)}
                />
              </li>
            );
          }

          return (
            <li key={`category-simple-${item.id}`} className={styles.skillItem}>
              <CheckboxUI
                variant="default"
                text={item.name}
                checked={selectedSkills.includes(item.id)}
                onToggle={() => toggleSkillSelection(item.id)}
              />
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={styles.toggleVisibility}
        onClick={handleToggleAll}
        aria-expanded={expanded}
      >
        <span className={styles.buttonLabel}>{expanded ? 'Свернуть' : 'Все категории'}</span>
        {expanded ? (
          <ChevronUp className={styles.arrowIcon} />
        ) : (
          <ChevronDown className={styles.arrowIcon} />
        )}
      </button>
    </section>
  );
}

export default SkillsFilter;
