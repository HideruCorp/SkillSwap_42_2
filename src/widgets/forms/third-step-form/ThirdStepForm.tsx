import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useMemo } from 'react';
import type { Category, Subcategory } from '@shared/types/index';
import { InputUI } from '@shared/ui/Input/index';
import { DropdownListUI, type OptionType } from '@shared/ui/dropdown-list/index';
import Textarea from '@shared/ui/textarea/Textarea';
import { DragDrop } from '@features/drag-drop/index';
import styles from './third-step-form.module.scss';
import { fetchCategories } from '@/api/categoriesApi';
import { ThirdStepValidationSchema } from '@/shared/lib/validationSchema';
import Button from '@/shared/ui/button/Button';

interface ThirdStepFormProps {
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
}

export type ThirdStepFormData = {
  skillName: string;
  category: OptionType[];
  subcategory: OptionType[];
  description: string;
  images: File[];
};

function ThirdStepForm({ setCurrentStep }: ThirdStepFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<ThirdStepFormData>({
    resolver: yupResolver(ThirdStepValidationSchema),
    defaultValues: {
      skillName: '',
      category: [],
      subcategory: [],
      description: '',
      images: [],
    },
    mode: 'onChange',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const selectedCategory = watch('category');

  // Получаем ID выбранной категории
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory && selectedCategory.length > 0) {
      return parseInt(selectedCategory[0].value, 10);
    }
    return null;
  }, [selectedCategory]);

  useEffect(() => {
    // Очищаем подкатегорию при изменении категории
    if (selectedCategory && selectedCategory.length > 0) {
      setValue('subcategory', []);
    }
  }, [selectedCategory, setValue]);

  useEffect(() => {
    // Потом можно будет брать категорию и подкатегорию из стора
    const fetchData = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result.categories);
        setSubcategories(result.subcategories);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchData();
  }, []);

  const categoryOptions = categories.map((category) => {
    return {
      title: category.name,
      value: String(category.id),
    };
  });

  // Фильтруем подкатегории в зависимости от выбранной категории
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 0) {
      return [];
    }
    return subcategories.filter((subcategory) => subcategory.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  // Преобразуем отфильтрованные подкатегории в OptionType
  const subcategoryOptions = filteredSubcategories.map((subcategory) => {
    return {
      title: subcategory.name,
      value: String(subcategory.id),
    };
  });

  const onSubmit = (data: ThirdStepFormData) => {
    console.log(data); // временная заглушка для вызова модалки или сохранения в стор
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Название навыка */}
        <div className={styles.input}>
          <Controller
            name="skillName"
            control={control}
            render={({ field }) => (
              <InputUI
                label="Название навыка"
                placeholder="Введите название вашего навыка"
                type="text"
                message={errors.skillName?.message || ''}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className={styles.input}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <DropdownListUI
                title="Категория навыка"
                options={categoryOptions}
                type="list"
                selected={field.value || []}
                onChange={(value: OptionType[]) => {
                  field.onChange(value);
                  setValue('subcategory', []);
                }}
                placeholder="Выберите категорию навыка"
              />
            )}
          />
          <span className={`${styles.error} ${styles.dropdown}`}>{errors.category?.message}</span>
        </div>

        {/* Подкатегория навыка */}
        <div className={styles.input}>
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <DropdownListUI
                title="Подкатегория навыка"
                options={subcategoryOptions}
                type="list"
                selected={field.value || []}
                onChange={field.onChange}
                placeholder={
                  !selectedCategoryId
                    ? 'Сначала выберите категорию'
                    : 'Выберите подкатегорию навыка'
                }
              />
            )}
          />
          <span className={`${styles.error} ${styles.dropdown}`}>
            {errors.subcategory?.message}
          </span>
        </div>

        {/* Описание навыка */}
        <div className={styles.input}>
          <span className={styles.label}>Описание</span>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                value={field.value}
                placeholder="Коротко опишите, чему можете научить"
                onChange={field.onChange}
              />
            )}
          />
          <span className={styles.error}>{errors.description?.message}</span>
        </div>

        {/* Drag & Drop для изображений */}
        <div className={styles['input-grag-and-drop']}>
          <Controller
            name="images"
            control={control}
            render={({ field }) => <DragDrop onFilesChange={(files) => field.onChange(files)} />}
          />
          <span className={styles.error}>{errors.images?.message}</span>
        </div>

        <div className={styles.buttons}>
          <Button
            className={styles.fullWidthButton}
            title="Назад"
            type="secondary"
            onClick={() => setCurrentStep(2)}
          />
          <Button
            htmlType="submit"
            className={styles.fullWidthButton}
            title="Продолжить"
            type="primary"
          />
        </div>
      </form>
    </div>
  );
}

export default ThirdStepForm;
