import Button from '@shared/ui/button/Button';
import type { Category, Subcategory } from '@shared/types';
import { selectSkillData } from '@features/auth/model/registrationSlice';
import categoryApi from '@entities/category/api/categoriesApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SkillGallery from '../../skillGallery/SkillGallery';
import editIcon from '../../../shared/assets/img/edit.svg';
import styles from './ModalSuggestion.module.scss';

interface ModalSuggestionProps {
  onClose: () => void;
  submit: () => void;
}

function ModalSuggestion({ submit, onClose }: ModalSuggestionProps) {
  const skill = useSelector(selectSkillData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await categoryApi.getAll();
        setCategories(result.categories);
        setSubcategories(result.subcategories);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };
    fetchData();
  }, []);

  const { skillTitle, skillSubcategoryId, skillDescription, skillImages } = skill;
  const subcategory = subcategories.filter(
    (subcategory) => subcategory.id === skillSubcategoryId
  )[0];
  const category = categories.filter((category) => category.id === subcategory.categoryId)[0];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ваше предложение</h2>
      <p className={styles.subTitle}>Пожалуйста, проверьте и подтвердите правильность данных</p>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div>
            <h1 className={styles.scilTitle}>{skillTitle}</h1>
            {subcategories.length !== 0 && (
              <p className={styles.categories}>
                {category.name} / {subcategory.name}
              </p>
            )}
          </div>
          <p className={styles.description}>{skillDescription}</p>
          <div className={styles.buttons}>
            <Button
              className={styles.button}
              variant="tertiary"
              onClick={onClose}
              title="Редактировать"
              iconRight={
                <img
                  src={editIcon}
                  alt="edit"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'inline-block',
                  }}
                />
              }
            />
            <Button className={styles.button} variant="primary" onClick={submit} title="Готово" />
          </div>
        </div>
        <SkillGallery images={skillImages} />
      </div>
    </div>
  );
}

export default ModalSuggestion;
