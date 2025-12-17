import { useCallback, useEffect, useMemo, useState } from 'react';
import categoryApi from '@entities/category/api/categoriesApi';
import { useDebouncedCallback } from '@shared/hooks/useDebounce';
import { filesToDataUrls } from '@shared/lib/image/compressImage';
import type { Category, Subcategory } from '@shared/types';
import SkillDataForm, {
  type SkillDataFormExternalErrors,
  type SkillDataFormSubmitPayload,
} from '@widgets/forms/skill-data-form';
import { useStepSkillData } from '@features/auth';

const DEBOUNCE_DELAY = 300;

interface SkillDataStepContainerProps {
  /** Вызывается после успешного submitStep(3) */
  onStepCompleted: () => void;
}

function SkillDataStep({ onStepCompleted }: SkillDataStepContainerProps) {
  const {
    skillData,
    errors: storeErrors,
    isSubmitting,
    updateSkillData,
    submitStep,
    prevStep,
    clearErrors,
  } = useStepSkillData();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Загружаем справочники (UI-данные, но это side-effect — держим в контейнере)
  useEffect(() => {
    const load = async () => {
      try {
        const result = await categoryApi.getAll();
        setCategories(result.categories);
        setSubcategories(result.subcategories);
      } catch (e) {
        // Можно прокинуть в ErrorBoundary/notification, но пока оставим console
        console.error('Ошибка при загрузке категорий:', e);
      }
    };

    load();
  }, []);

  const externalErrors: SkillDataFormExternalErrors | undefined = useMemo(() => {
    if (!storeErrors) return undefined;

    const mapped: SkillDataFormExternalErrors = {
      skillName: storeErrors.skillTitle,
      subcategory: storeErrors.skillSubcategoryId,
      description: storeErrors.skillDescription,
      images: storeErrors.skillImages,
    };

    return mapped;
  }, [storeErrors]);

  const updateTitleDebounced = useDebouncedCallback((value: string) => {
    updateSkillData({ skillTitle: value });
  }, DEBOUNCE_DELAY);

  const updateDescriptionDebounced = useDebouncedCallback((value: string) => {
    updateSkillData({ skillDescription: value });
  }, DEBOUNCE_DELAY);

  const handleFormChange = useCallback(
    (
      patch: Partial<{
        skillTitle: string;
        skillDescription: string;
        skillSubcategoryId: number | null;
      }>
    ) => {
      if (storeErrors) {
        clearErrors();
      }

      if (patch.skillTitle !== undefined) {
        updateTitleDebounced(patch.skillTitle);
      }

      if (patch.skillDescription !== undefined) {
        updateDescriptionDebounced(patch.skillDescription);
      }

      if (patch.skillSubcategoryId !== undefined) {
        updateSkillData({ skillSubcategoryId: patch.skillSubcategoryId });
      }
    },
    [storeErrors, clearErrors, updateSkillData, updateTitleDebounced, updateDescriptionDebounced]
  );

  const handleSubmit = useCallback(
    async (payload: SkillDataFormSubmitPayload) => {
      // Перед submitStep обязательно синхронизируем актуальные значения в store
      updateSkillData({
        skillTitle: payload.skillTitle,
        skillDescription: payload.skillDescription,
        skillSubcategoryId: payload.skillSubcategoryId,
      });

      // Конвертация изображений — бизнес/side-effect: в контейнер
      const files = payload.images.map((i) => i.file);
      const dataUrls = await filesToDataUrls(files);
      updateSkillData({ skillImages: dataUrls });

      const success = await submitStep();
      if (success) {
        onStepCompleted();
      }
    },
    [updateSkillData, submitStep, onStepCompleted]
  );

  return (
    <SkillDataForm
      initialValues={{
        skillTitle: skillData.skillTitle,
        skillDescription: skillData.skillDescription,
        skillSubcategoryId: skillData.skillSubcategoryId,
      }}
      categories={categories}
      subcategories={subcategories}
      isSubmitting={isSubmitting}
      externalErrors={externalErrors}
      onPrev={prevStep}
      onSubmit={handleSubmit}
      onChange={handleFormChange}
    />
  );
}

export default SkillDataStep;
export { SkillDataStep };
