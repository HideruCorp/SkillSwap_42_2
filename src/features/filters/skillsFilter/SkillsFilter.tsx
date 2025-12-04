import React, { useState, useMemo, useEffect } from 'react';
import styles from './skills-filter.module.scss';
import { CheckboxUI } from '@shared/ui/checkbox/CheckboxUI';
import ChevronUp from '@shared/assets/img/chevron-Up.svg?react';
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react';
import type { SkillsFilterProps } from './types';

interface ISkill {
  id: number;
  name: string;
  isCreativeSubcategory?: boolean;
}

export const SkillsFilter: React.FC<SkillsFilterProps> = ({
  selectedSkills,
  onSelectionChange,
}) => {
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showCreativeSubcategories, setShowCreativeSubcategories] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetch('/db/category.json')
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки category.json:', err);
        setLoading(false);
      });
  }, []);

  const allSkills = useMemo((): ISkill[] => {
    if (!categoryData) return [];

    const result: ISkill[] = [];

    const categoryOrder = [1, 4, 2, 5, 6, 3];

    categoryOrder.forEach((categoryId) => {
      const category = categoryData.categories.find((c) => c.id === categoryId);
      if (category) {
        result.push({
          id: category.id,
          name: category.name,
        });
      }

      // Добавляем подкатегории только для творчества (id = 4)
      if (categoryId === 4) {
        const creativeSubs = categoryData.subcategories.filter((sub) => sub.categoryId === 4);

        creativeSubs.forEach((sub) => {
          result.push({
            id: sub.id,
            name: sub.name,
            isCreativeSubcategory: true,
          });
        });
      }
    });

    return result;
  }, [categoryData]);

  const creativeSubcategoryIds = useMemo(() => {
    if (!categoryData) return [];
    return categoryData.subcategories.filter((sub) => sub.categoryId === 4).map((sub) => sub.id);
  }, [categoryData]);

  const areAllCreativeSubcategoriesSelected = useMemo(() => {
    return creativeSubcategoryIds.every((id) => selectedSkills.includes(id));
  }, [selectedSkills, creativeSubcategoryIds]);

  const isAnyCreativeSubcategorySelected = useMemo(() => {
    return creativeSubcategoryIds.some((id) => selectedSkills.includes(id));
  }, [selectedSkills, creativeSubcategoryIds]);

  const visibleSkills = useMemo(() => {
    if (expanded) {
      return allSkills;
    }

    let skills = allSkills.filter((skill) => !skill.isCreativeSubcategory);

    if (showCreativeSubcategories) {
      const creativeSubs = allSkills.filter((skill) => skill.isCreativeSubcategory);
      const creativityIndex = skills.findIndex((skill) => skill.id === 4);
      if (creativityIndex !== -1) {
        skills.splice(creativityIndex + 1, 0, ...creativeSubs);
      }
    }

    return skills;
  }, [allSkills, expanded, showCreativeSubcategories]);

  const toggleSkillSelection = (skillId: number) => {
    const updatedSelection = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId];
    onSelectionChange(updatedSelection);
  };

  const handleCreativeCategoryToggle = () => {
    const allSelected = areAllCreativeSubcategoriesSelected;

    if (allSelected) {
      const newSelection = selectedSkills.filter((id) => !creativeSubcategoryIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      const newSelection = [...selectedSkills];
      creativeSubcategoryIds.forEach((id) => {
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

  // Показать loader пока данные загружаются
  if (loading || !categoryData) {
    return (
      <section className={styles.filterContainer}>
        <h2 className={styles.sectionTitle}>Навыки</h2>
        <p>Загрузка...</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>Навыки</h2>
      <ul className={styles.skillsList}>
        {visibleSkills.map((skill) => {
          // "Творчество и искусство" с особой логикой
          if (skill.id === 4) {
            return (
              <li key={skill.id} className={styles.skillItem}>
                <div className={styles.categoryWithArrow}>
                  <CheckboxUI
                    variant={isAnyCreativeSubcategorySelected ? 'remove' : 'default'}
                    text={skill.name}
                    checked={isAnyCreativeSubcategorySelected}
                    onToggle={handleCreativeCategoryToggle}
                  />
                  <button
                    type="button"
                    className={styles.toggleSubcategories}
                    onClick={() => setShowCreativeSubcategories(!showCreativeSubcategories)}
                    aria-expanded={showCreativeSubcategories}
                  >
                    {showCreativeSubcategories ? (
                      <ChevronUp className={styles.arrowIcon} />
                    ) : (
                      <ChevronDown className={styles.arrowIcon} />
                    )}
                  </button>
                </div>
              </li>
            );
          }

          if (skill.isCreativeSubcategory) {
            return (
              <li key={skill.id} className={styles.skillItem} style={{ marginLeft: '32px' }}>
                <CheckboxUI
                  variant="default"
                  text={skill.name}
                  checked={selectedSkills.includes(skill.id)}
                  onToggle={() => toggleSkillSelection(skill.id)}
                />
              </li>
            );
          }

          // Обычные категории
          return (
            <li key={skill.id} className={styles.skillItem}>
              <CheckboxUI
                variant="default"
                text={skill.name}
                checked={selectedSkills.includes(skill.id)}
                onToggle={() => toggleSkillSelection(skill.id)}
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
};

export default SkillsFilter;
