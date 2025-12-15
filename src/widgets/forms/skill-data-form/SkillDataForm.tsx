import { DragDrop, type FileWithPreview } from '@features/drag-drop';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThirdStepValidationSchema } from '@shared/lib/validationSchema';
import type { Category, Subcategory } from '@shared/types';
import { InputUI } from '@shared/ui/Input';
import Button from '@shared/ui/button/Button';
import { DropdownListUI, type OptionType } from '@shared/ui/dropdown-list';
import Textarea from '@shared/ui/textarea/Textarea';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './skill-data-form.module.scss';

export type ThirdStepFormData = {
  skillName: string;
  category: OptionType[];
  subcategory: OptionType[];
  description: string;
  images: FileWithPreview[];
};

export type SkillDataFormSubmitPayload = {
  skillTitle: string;
  skillDescription: string;
  skillSubcategoryId: number | null;
  images: FileWithPreview[];
};

export type SkillDataFormExternalErrors = Partial<
  Record<'skillName' | 'category' | 'subcategory' | 'description' | 'images', string>
>;

interface SkillDataFormProps {
  /** Начальные значения из wizard store */
  initialValues: {
    skillTitle: string;
    skillDescription: string;
    skillSubcategoryId: number | null;
  };

  /** Справочники (загружает контейнер) */
  categories: Category[];
  subcategories: Subcategory[];

  /** Статусы */
  isSubmitting?: boolean;

  /** Ошибки “снаружи” (например, из redux stepErrors) */
  externalErrors?: SkillDataFormExternalErrors;

  /** Навигация */
  onPrev: () => void;

  /** Сабмит шага (контейнер сделает updateSkillData + submitStep + onSubmitSuccess и т.д.) */
  onSubmit: (payload: SkillDataFormSubmitPayload) => Promise<void> | void;

  /**
   * Опционально: уведомление контейнера об изменениях (для синхронизации со стором/сброса ошибок)
   * Важно: не делайте здесь тяжёлые операции (конвертацию файлов) — лучше в контейнере на submit.
   */
  onChange?: (
    patch: Partial<Omit<SkillDataFormSubmitPayload, 'images'> & { images: FileWithPreview[] }>
  ) => void;
}

function SkillDataForm({
  initialValues,
  categories,
  subcategories,
  isSubmitting = false,
  externalErrors,
  onPrev,
  onSubmit,
  onChange,
}: SkillDataFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<ThirdStepFormData>({
    resolver: yupResolver(ThirdStepValidationSchema),
    defaultValues: {
      skillName: initialValues.skillTitle,
      category: [],
      subcategory: [],
      description: initialValues.skillDescription,
      images: [],
    },
    mode: 'onChange',
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const selectedCategory = watch('category');

  const selectedCategoryId = useMemo(() => {
    if (selectedCategory && selectedCategory.length > 0) {
      return parseInt(selectedCategory[0].value, 10);
    }
    return null;
  }, [selectedCategory]);

  // Инициализация категории/подкатегории из initialValues.skillSubcategoryId
  useEffect(() => {
    if (
      initialValues.skillSubcategoryId !== null &&
      subcategories.length > 0 &&
      categories.length > 0 &&
      !isInitialized
    ) {
      const storedSubcategory = subcategories.find(
        (sc) => sc.id === initialValues.skillSubcategoryId
      );
      if (!storedSubcategory) return;

      const parentCategory = categories.find((cat) => cat.id === storedSubcategory.categoryId);
      if (parentCategory) {
        setValue('category', [{ title: parentCategory.name, value: String(parentCategory.id) }]);
      }

      setValue('subcategory', [
        { title: storedSubcategory.name, value: String(storedSubcategory.id) },
      ]);
      setIsInitialized(true);
    }
  }, [initialValues.skillSubcategoryId, subcategories, categories, setValue, isInitialized]);

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        title: cat.name,
        value: String(cat.id),
      })),
    [categories]
  );

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 0) return [];
    return subcategories.filter((sc) => sc.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  const subcategoryOptions = useMemo(
    () =>
      filteredSubcategories.map((sc) => ({
        title: sc.name,
        value: String(sc.id),
      })),
    [filteredSubcategories]
  );

  const getFieldError = useCallback(
    (fieldName: keyof ThirdStepFormData | 'subcategory') => {
      const formError =
        fieldName === 'subcategory'
          ? errors.subcategory?.message
          : errors[fieldName as keyof ThirdStepFormData]?.message;

      const external =
        fieldName === 'subcategory'
          ? externalErrors?.subcategory
          : externalErrors?.[fieldName as keyof SkillDataFormExternalErrors];

      return formError || external || '';
    },
    [errors, externalErrors]
  );

  const handlePrevStep = useCallback(() => {
    onPrev();
  }, [onPrev]);

  const handleInternalSubmit = useCallback(
    async (data: ThirdStepFormData) => {
      const skillSubcategoryId =
        data.subcategory.length > 0 ? parseInt(data.subcategory[0].value, 10) : null;

      await onSubmit({
        skillTitle: data.skillName,
        skillDescription: data.description,
        skillSubcategoryId,
        images: data.images,
      });
    },
    [onSubmit]
  );

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(handleInternalSubmit)}>
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
                onChange={(value) => {
                  field.onChange(value);
                  onChange?.({ skillTitle: value });
                }}
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
                  // Сбрасываем subcategoryId в контейнер
                  onChange?.({ skillSubcategoryId: null });
                }}
                groupId="skill-data-form"
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
                onChange={(value) => {
                  field.onChange(value);

                  const subcategoryId =
                    value && value.length > 0 ? parseInt(value[0].value, 10) : null;

                  onChange?.({ skillSubcategoryId: subcategoryId });
                }}
                groupId="skill-data-form"
                disabled={!selectedCategoryId}
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
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange?.({ skillDescription: e.target.value });
                }}
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
            render={({ field }) => (
              <DragDrop
                onFilesChange={(files) => {
                  field.onChange(files);
                  onChange?.({ images: files });
                }}
              />
            )}
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
