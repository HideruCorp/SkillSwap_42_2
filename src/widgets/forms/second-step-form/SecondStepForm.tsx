import React, { useState, useEffect, useMemo, useCallback } from 'react';
import InputUI from '@shared/ui/Input/InputUI';
import DatePickerUI from '@shared/ui/date-picker/DatePickerUI';
import DropdownListUI from '@shared/ui/dropdown-list/DropdownListUI';
import AvatarPicker from '@features/avatar-picker/AvatarPicker';
import Button from '@shared/ui/button/Button';
import useStepUserData from '@features/auth/hooks/useStepUserData';
import { fetchCities } from '@api/citiesApi';
import { fetchCategories } from '@api/categoriesApi';
import { compressImage } from '@shared/lib/image/compressImage';
import type { City, Category, Subcategory } from '@shared/types';
import type { OptionType } from '@shared/ui/dropdown-list';
import styles from './second-step-form.module.scss';

interface SecondStepFormProps {
  onSubmit?: () => void;
  onBack?: () => void;
}

const genderOptions: OptionType[] = [
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
  { value: 'all', title: 'Не указан' },
];

export function SecondStepForm({ onSubmit, onBack }: SecondStepFormProps) {
  const { userData, errors: storeErrors, isSubmitting, updateUserData, submitStep, prevStep, clearErrors } = useStepUserData();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [citiesData, categoriesData] = await Promise.all([fetchCities(), fetchCategories()]);
        setCities(citiesData);
        setCategories(categoriesData.categories);
        setSubcategories(categoriesData.subcategories);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (userData.dateOfBirth) {
      const date = new Date(userData.dateOfBirth);
      if (!isNaN(date.getTime())) {
        setBirthDate(date);
      }
    } else {
      setBirthDate(undefined);
    }
  }, [userData.dateOfBirth]);

  useEffect(() => {
    if (userData.skillInterests.length > 0 && subcategories.length > 0) {
      const firstInterestId = userData.skillInterests[0];
      const subcategory = subcategories.find((sc) => sc.id === firstInterestId);
      if (subcategory) {
        setSelectedCategoryId(subcategory.categoryId);
        setSelectedSubcategoryId(subcategory.id);
      }
    }
  }, [userData.skillInterests, subcategories]);

  useEffect(() => {
    const handleDropdownPosition = () => {
      const openDropdowns = document.querySelectorAll('.openSelect, .menu');

      openDropdowns.forEach((dropdown) => {
        const trigger = dropdown.closest('.dropdownWrapper, .datePickerWrapper');

        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const dropdownHeight = 300;

          if (rect.bottom + dropdownHeight > viewportHeight) {
            dropdown.style.top = `${rect.top + window.scrollY - dropdownHeight - 5}px`;
          } else {
            dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
          }

          dropdown.style.left = `${rect.left + window.scrollX}px`;
          dropdown.style.width = `${rect.width}px`;
          dropdown.style.position = 'fixed';
          dropdown.style.zIndex = '9999';
        }
      });
    };

    const observer = new MutationObserver(handleDropdownPosition);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', handleDropdownPosition);
    window.addEventListener('scroll', handleDropdownPosition);

    handleDropdownPosition();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleDropdownPosition);
      window.removeEventListener('scroll', handleDropdownPosition);
    };
  }, []);

  const cityOptions: OptionType[] = useMemo(
    () => cities.map((city) => ({ value: String(city.id), title: city.name })),
    [cities]
  );

  const categoryOptions: OptionType[] = useMemo(
    () => categories.map((cat) => ({ value: String(cat.id), title: cat.name })),
    [categories]
  );

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter((sc) => sc.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  const subcategoryOptions: OptionType[] = useMemo(
    () => filteredSubcategories.map((sc) => ({ value: String(sc.id), title: sc.name })),
    [filteredSubcategories]
  );

  const selectedCityOption = useMemo(() => {
    if (userData.cityId === null) return [];
    return cityOptions.filter((opt) => opt.value === String(userData.cityId));
  }, [cityOptions, userData.cityId]);

  const selectedGenderOption = useMemo(() => {
    return genderOptions.filter((opt) => opt.value === userData.gender);
  }, [userData.gender]);

  const selectedCategoryOption = useMemo(() => {
    if (selectedCategoryId === null) return [];
    return categoryOptions.filter((opt) => opt.value === String(selectedCategoryId));
  }, [categoryOptions, selectedCategoryId]);

  const selectedSubcategoryOption = useMemo(() => {
    if (selectedSubcategoryId === null) return [];
    return subcategoryOptions.filter((opt) => opt.value === String(selectedSubcategoryId));
  }, [subcategoryOptions, selectedSubcategoryId]);

  const handleNameChange = useCallback(
    (value: string) => {
      updateUserData({ name: value });
      if (storeErrors?.name) {
        clearErrors();
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleBirthDateChange = useCallback(
    (date: Date | undefined) => {
      setBirthDate(date);
      const dateString = date ? date.toISOString() : '';
      updateUserData({ dateOfBirth: dateString });
      if (storeErrors?.dateOfBirth) {
        clearErrors();
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleGenderChange = useCallback(
    (selected: OptionType[]) => {
      if (selected.length > 0) {
        const gender = selected[0].value as 'male' | 'female' | 'all';
        updateUserData({ gender });
        if (storeErrors?.gender) {
          clearErrors();
        }
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleCityChange = useCallback(
    (selected: OptionType[]) => {
      if (selected.length > 0) {
        const cityId = parseInt(selected[0].value, 10);
        updateUserData({ cityId });
        if (storeErrors?.cityId) {
          clearErrors();
        }
      } else {
        updateUserData({ cityId: null });
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleCategoryChange = useCallback(
    (selected: OptionType[]) => {
      if (selected.length > 0) {
        const categoryId = parseInt(selected[0].value, 10);
        setSelectedCategoryId(categoryId);
        setSelectedSubcategoryId(null);
        updateUserData({ skillInterests: [] });
      } else {
        setSelectedCategoryId(null);
        setSelectedSubcategoryId(null);
        updateUserData({ skillInterests: [] });
      }
      if (storeErrors?.skillInterests) {
        clearErrors();
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleSubcategoryChange = useCallback(
    (selected: OptionType[]) => {
      if (selected.length > 0) {
        const subcategoryId = parseInt(selected[0].value, 10);
        setSelectedSubcategoryId(subcategoryId);
        updateUserData({ skillInterests: [subcategoryId] });
      } else {
        setSelectedSubcategoryId(null);
        updateUserData({ skillInterests: [] });
      }
      if (storeErrors?.skillInterests) {
        clearErrors();
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleAvatarChange = useCallback(
    async (file: File | null) => {
      setAvatarFile(file);
      if (file) {
        try {
          const avatarUrl = await compressImage(file);
          updateUserData({ avatarUrl });
        } catch (error) {
          console.error('Ошибка при обработке аватара:', error);
        }
      } else {
        updateUserData({ avatarUrl: '' });
      }
      if (storeErrors?.avatarUrl) {
        clearErrors();
      }
    },
    [updateUserData, storeErrors, clearErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await submitStep();
      if (success && onSubmit) {
        onSubmit();
      }
    },
    [submitStep, onSubmit]
  );

  const handleBack = useCallback(() => {
    prevStep();
    if (onBack) {
      onBack();
    }
  }, [prevStep, onBack]);

  const getFieldError = (fieldName: keyof typeof storeErrors): string => {
    return storeErrors?.[fieldName] || '';
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.avatarSection}>
          <AvatarPicker
            onAvatarChange={handleAvatarChange}
            initialAvatarUrl={userData.avatarUrl || undefined}
            size={100}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Имя</label>
          <InputUI
            value={userData.name}
            onChange={handleNameChange}
            placeholder="Введите ваше имя"
            error={getFieldError('name')}
          />
        </div>

        <div className={styles.rowSection}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Дата рождения</label>
            <div className={styles.datePickerWrapper}>
              <DatePickerUI
                value={birthDate}
                onChange={handleBirthDateChange}
                placeholder="ДД.ММ.ГГГГ"
                error={getFieldError('dateOfBirth')}
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Пол</label>
            <div className={styles.dropdownWrapper}>
              <DropdownListUI
                type="list"
                options={genderOptions}
                selected={selectedGenderOption}
                onChange={handleGenderChange}
                placeholder="Не указан"
              />
            </div>
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Город</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={cityOptions}
              selected={selectedCityOption}
              onChange={handleCityChange}
              placeholder="Выберите город"
            />
          </div>
          {getFieldError('cityId') && <span className={styles.errorText}>{getFieldError('cityId')}</span>}
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Категория навыка, которому хотите научиться</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={categoryOptions}
              selected={selectedCategoryOption}
              onChange={handleCategoryChange}
              placeholder="Выберите категорию"
            />
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Подкатегория навыка, которому хотите научиться</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={subcategoryOptions}
              selected={selectedSubcategoryOption}
              onChange={handleSubcategoryChange}
              placeholder={!selectedCategoryId ? 'Сначала выберите категорию' : 'Выберите подкатегорию'}
              disabled={!selectedCategoryId}
            />
          </div>
          {getFieldError('skillInterests') && (
            <span className={styles.errorText}>{getFieldError('skillInterests')}</span>
          )}
        </div>

        <div className={styles.buttonsSection}>
          <div className={styles.buttons}>
            <Button
              type="default"
              title="Назад"
              onClick={handleBack}
              className={styles.backButton}
            />
            <Button
              type="primary"
              title={isSubmitting ? 'Обработка...' : 'Продолжить'}
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SecondStepForm;