import { useEffect, useState, type SyntheticEvent } from 'react';
import type { Category, Subcategory } from '@shared/types';
import categoriesApi from '@entities/category/api/categoriesApi';
import Modal from '@features/modal/Modal';
import styles from './all-skills-dropdown.module.scss';
import AllSkillsModal from './all-skills-modal/AllSkillsModal';

function AllSkillsDropdown() {
  const [categories, setCategory] = useState<Category[]>([]);
  const [subcategories, setSubcategory] = useState<Subcategory[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // если categories/subcategories будут храниться в общем сторе, можно брать их оттуда, без запроса
  const fetchData = async () => {
    const result = await categoriesApi.getAll();
    setCategory(result.categories);
    setSubcategory(result.subcategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setIsOpenModal(false);
  };
  const handleOpen = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsOpenModal(true);
  };

  return (
    <>
      <a href="#allskills" onClick={handleOpen} className={`${styles.allSkillsDropdown}`}>
        Все навыки
        <img
          className={`${styles.allSkillsDropdownImg}`}
          src="../../../src/shared/assets/img/chevron-Down.svg"
          alt="раскрытие списка навыков"
        />
      </a>
      {isOpenModal && (
        <Modal onClose={handleClose} className={styles.skillModal}>
          <AllSkillsModal categories={categories} subcategories={subcategories} />
        </Modal>
      )}
    </>
  );
}

export default AllSkillsDropdown;
