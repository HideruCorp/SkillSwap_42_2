import { fetchCategories } from '@api/categoriesApi';
import { DragDrop, type FileWithPreview } from '@features/drag-drop';
import { useStepSkillData } from '@features/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebounce } from '@shared/hooks/useDebounce';
import { filesToDataUrls } from '@shared/lib/image/compressImage';
import { ThirdStepValidationSchema } from '@shared/lib/validationSchema';
import type { Category, Subcategory } from '@shared/types';
import { InputUI } from '@shared/ui/Input';
import Button from '@shared/ui/button/Button';
import { DropdownListUI, type OptionType } from '@shared/ui/dropdown-list';
import Textarea from '@shared/ui/textarea/Textarea';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './skill-data-form.module.scss';

const DEBOUNCE_DELAY = 300;

export type ThirdStepFormData = {
  skillName: string;
  category: OptionType[];
  subcategory: OptionType[];
  description: string;
  images: FileWithPreview[];
};

interface SkillDataFormProps {
  onSubmitSuccess: () => void;
}

function SkillDataForm({ onSubmitSuccess }: SkillDataFormProps) {
  const {
    skillData,
    errors: storeErrors,
    isSubmitting,
    updateSkillData,
    submitStep,
    prevStep,
    clearErrors,
  } = useStepSkillData();

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<ThirdStepFormData>({
    resolver: yupResolver(ThirdStepValidationSchema),
    defaultValues: {
      skillName: skillData.skillTitle,
      category: [],
      subcategory: [],
      description: skillData.skillDescription,
      images: [],
    },
    mode: 'onChange',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Watch для отслеживания изменений
  const selectedCategory = watch('category');
  const watchedSkillName = watch('skillName');
  const watchedDescription = watch('description');
  const watchedSubcategory = watch('subcategory');
  const watchedImages = watch('images');

  // Debounced значения для синхронизации со стором
  const debouncedSkillName = useDebounce(watchedSkillName, DEBOUNCE_DELAY);
  const debouncedDescription = useDebounce(watchedDescription, DEBOUNCE_DELAY);

  // Получаем ID выбранной категории
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory && selectedCategory.length > 0) {
      return parseInt(selectedCategory[0].value, 10);
    }
    return null;
  }, [selectedCategory]);

  // Загрузка категорий
  useEffect(() => {
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

  // Инициализация категории и подкатегории из стора при загрузке данных
  useEffect(() => {
    if (
      skillData.skillSubcategoryId !== null &&
      subcategories.length > 0 &&
      categories.length > 0 &&
      !isInitialized
    ) {
      const storedSubcategory = subcategories.find((sc) => sc.id === skillData.skillSubcategoryId);
      if (storedSubcategory) {
        // Установить категорию
        const parentCategory = categories.find((cat) => cat.id === storedSubcategory.categoryId);
        if (parentCategory) {
          setValue('category', [{ title: parentCategory.name, value: String(parentCategory.id) }]);
        }
        // Установить подкатегорию
        setValue('subcategory', [
          { title: storedSubcategory.name, value: String(storedSubcategory.id) },
        ]);
        setIsInitialized(true);
      }
    }
  }, [skillData.skillSubcategoryId, subcategories, categories, setValue, isInitialized]);

  // Синхронизация debounced skillName со стором
  useEffect(() => {
    if (debouncedSkillName !== skillData.skillTitle) {
      updateSkillData({ skillTitle: debouncedSkillName });
    }
  }, [debouncedSkillName, skillData.skillTitle, updateSkillData]);

  // Синхронизация debounced description со стором
  useEffect(() => {
    if (debouncedDescription !== skillData.skillDescription) {
      updateSkillData({ skillDescription: debouncedDescription });
    }
  }, [debouncedDescription, skillData.skillDescription, updateSkillData]);

  // Синхронизация подкатегории со стором
  useEffect(() => {
    const subcategoryId =
      watchedSubcategory && watchedSubcategory.length > 0
        ? parseInt(watchedSubcategory[0].value, 10)
        : null;

    if (subcategoryId !== skillData.skillSubcategoryId) {
      updateSkillData({ skillSubcategoryId: subcategoryId });
    }
  }, [watchedSubcategory, skillData.skillSubcategoryId, updateSkillData]);

  // Синхронизация изображений со стором
  useEffect(() => {
    const syncImages = async () => {
      if (watchedImages && watchedImages.length > 0) {
        try {
          // Извлекаем File объекты из FileWithPreview
          const files = watchedImages.map((item) => item.file);
          const dataUrls = await filesToDataUrls(files);
          updateSkillData({ skillImages: dataUrls });
        } catch (error) {
          console.error('Ошибка при конвертации изображений:', error);
        }
      } else {
        updateSkillData({ skillImages: [] });
      }
    };

    syncImages();
  }, [watchedImages, updateSkillData]);

  // Очистка ошибок стора при изменении данных формы
  useEffect(() => {
    if (storeErrors) {
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedSkillName, watchedDescription, watchedSubcategory, watchedImages]);

  // Преобразование категорий в опции dropdown
  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        title: cat.name,
        value: String(cat.id),
      })),
    [categories]
  );

  // Фильтруем подкатегории в зависимости от выбранной категории
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 0) {
      return [];
    }
    return subcategories.filter((sc) => sc.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  // Преобразуем отфильтрованные подкатегории в OptionType
  const subcategoryOptions = useMemo(
    () =>
      filteredSubcategories.map((sc) => ({
        title: sc.name,
        value: String(sc.id),
      })),
    [filteredSubcategories]
  );

  const handlePrevStep = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const onSubmit = useCallback(
    async (data: ThirdStepFormData) => {
      // Синхронизируем все данные перед отправкой
      updateSkillData({
        skillTitle: data.skillName,
        skillDescription: data.description,
        skillSubcategoryId:
          data.subcategory.length > 0 ? parseInt(data.subcategory[0].value, 10) : null,
      });

      // Конвертируем изображения
      if (data.images.length > 0) {
        const files = data.images.map((item) => item.file);
        const dataUrls = await filesToDataUrls(files);
        updateSkillData({ skillImages: dataUrls });
      }

      const success = await submitStep();
      if (success) {
        onSubmitSuccess();
      }
    },
    [updateSkillData, submitStep, onSubmitSuccess]
  );

  // Объединяем ошибки из react-hook-form и стора
  const getFieldError = (
    fieldName: 'skillName' | 'category' | 'subcategory' | 'description' | 'images'
  ) => {
    // Маппинг полей формы на поля стора
    const storeFieldMap: Record<string, string> = {
      skillName: 'skillTitle',
      subcategory: 'skillSubcategoryId',
      description: 'skillDescription',
      images: 'skillImages',
    };

    const formError = errors[fieldName]?.message;
    const storeField = storeFieldMap[fieldName] as keyof typeof storeErrors;
    const storeError = storeErrors?.[storeField];

    return formError || storeError || '';
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
                message={getFieldError('skillName')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Категория навыка */}
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
          <span className={`${styles.error} ${styles.dropdown}`}>{getFieldError('category')}</span>
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
            {getFieldError('subcategory')}
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
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <span className={styles.error}>{getFieldError('description')}</span>
        </div>

        {/* Drag & Drop для изображений */}
        <div className={styles['input-grag-and-drop']}>
          <Controller
            name="images"
            control={control}
            render={({ field }) => <DragDrop onFilesChange={(files) => field.onChange(files)} />}
          />
          <span className={styles.error}>{getFieldError('images')}</span>
        </div>

        <div className={styles.buttons}>
          <Button
            className={styles.fullWidthButton}
            title="Назад"
            type="secondary"
            onClick={handlePrevStep}
          />
          <Button
            htmlType="submit"
            className={styles.fullWidthButton}
            title={isSubmitting ? 'Обработка...' : 'Продолжить'}
            type="primary"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default SkillDataForm;
