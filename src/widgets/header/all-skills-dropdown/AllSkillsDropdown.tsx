import styles from './all-skills-dropdown.module.scss';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/api/categoriesApi';
import type { Category, Subcategory } from '@shared/types';

function AllSkillsDropdown() {
  const [category, setCategory] = useState<Category[]>();
  const [subcategory, setSubcategory] = useState<Subcategory[]>();

  const fetchData = async () => {
    const result = await fetchCategories();
    setCategory(result.categories);
    setSubcategory(result.subcategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <a href="#allskills" className={`${styles.allSkillsDropdown}`}>
        Все навыки
        <img
          className={`${styles.allSkillsDropdownImg}`}
          src="../../../src/shared/assets/img/chevron-Down.svg"
          alt="раскрытие списка навыков"
        />
      </a>
    </>
  );
}

export default AllSkillsDropdown;
