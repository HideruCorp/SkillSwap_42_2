import React, { useState, useEffect } from 'react';
import InputUI from '@shared/ui/Input/InputUI';
import DatePickerUI from '@shared/ui/date-picker/DatePickerUI';
import DropdownListUI from '@shared/ui/dropdown-list/DropdownListUI';
import AvatarPicker from '@features/avatar-picker/AvatarPicker';
import Button from '@shared/ui/button/Button';
import styles from './second-step-form.module.scss';

interface SecondStepFormData {
  avatar: File | null;
  name: string;
  birthDate: Date | undefined;
  gender: string;
  city: string;
  category: string;
  subcategory: string;
}

interface SecondStepFormProps {
  onSubmit: (data: SecondStepFormData) => void;
  onBack: () => void;
  initialData?: Partial<SecondStepFormData>;
}

const genderOptions = [
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
  { value: 'other', title: 'Другой' },
  { value: 'not_specified', title: 'Не указан' },
];

const cityOptions = [
  { value: 'moscow', title: 'Москва' },
  { value: 'spb', title: 'Санкт-Петербург' },
  { value: 'ekb', title: 'Екатеринбург' },
  { value: 'kazan', title: 'Казань' },
  { value: 'novosibirsk', title: 'Новосибирск' },
  { value: 'not_specified', title: 'Не указан' },
];

const categoryOptions = [
  { value: 'it', title: 'IT и программирование' },
  { value: 'design', title: 'Дизайн' },
  { value: 'marketing', title: 'Маркетинг' },
  { value: 'languages', title: 'Иностранные языки' },
  { value: 'music', title: 'Музыка' },
  { value: 'sport', title: 'Спорт' },
  { value: 'cooking', title: 'Кулинария' },
];

const subcategoryOptions: Record<string, Array<{ value: string; title: string }>> = {
  it: [
    { value: 'web', title: 'Веб-разработка' },
    { value: 'mobile', title: 'Мобильная разработка' },
    { value: 'data', title: 'Анализ данных' },
    { value: 'ai', title: 'Искусственный интеллект' },
  ],
  design: [
    { value: 'uiux', title: 'UI/UX дизайн' },
    { value: 'graphic', title: 'Графический дизайн' },
    { value: 'motion', title: 'Motion дизайн' },
  ],
  languages: [
    { value: 'english', title: 'Английский' },
    { value: 'spanish', title: 'Испанский' },
    { value: 'chinese', title: 'Китайский' },
  ],
  music: [
    { value: 'guitar', title: 'Гитара' },
    { value: 'piano', title: 'Фортепиано' },
    { value: 'vocals', title: 'Вокал' },
  ],
  sport: [
    { value: 'yoga', title: 'Йога' },
    { value: 'fitness', title: 'Фитнес' },
    { value: 'running', title: 'Бег' },
  ],
  cooking: [
    { value: 'baking', title: 'Выпечка' },
    { value: 'asian', title: 'Азиатская кухня' },
    { value: 'vegetarian', title: 'Вегетарианская кухня' },
  ],
  marketing: [
    { value: 'smm', title: 'SMM' },
    { value: 'seo', title: 'SEO' },
    { value: 'copywriting', title: 'Копирайтинг' },
  ],
};

export function SecondStepForm({ onSubmit, onBack, initialData = {} }: SecondStepFormProps) {
  const [formData, setFormData] = useState<SecondStepFormData>({
    avatar: initialData.avatar || null,
    name: initialData.name || '',
    birthDate: initialData.birthDate,
    gender: initialData.gender || 'not_specified',
    city: initialData.city || 'not_specified',
    category: initialData.category || '',
    subcategory: initialData.subcategory || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (formData.birthDate) {
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100);
      const maxDate = new Date();

      if (formData.birthDate < minDate) {
        newErrors.birthDate = 'Введите корректную дату рождения';
      } else if (formData.birthDate > maxDate) {
        newErrors.birthDate = 'Нельзя выбрать будущую дату';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (formData.category && !formData.subcategory) {
      newErrors.subcategory = 'Выберите подкатегорию';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SecondStepFormData) => (value: string | Date | undefined | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'category' && value !== formData.category) {
      setFormData(prev => ({
        ...prev,
        subcategory: '',
      }));
    }
  };

  const handleCategoryChange = (selected: Array<{ value: string; title: string }>) => {
    if (Array.isArray(selected) && selected.length > 0) {
      handleInputChange('category')(selected[0].value || '');
    }
  };

  const handleGenderChange = (selected: Array<{ value: string; title: string }>) => {
    if (Array.isArray(selected) && selected.length > 0) {
      handleInputChange('gender')(selected[0].value || 'not_specified');
    }
  };

  const handleCityChange = (selected: Array<{ value: string; title: string }>) => {
    if (Array.isArray(selected) && selected.length > 0) {
      handleInputChange('city')(selected[0].value || 'not_specified');
    }
  };

  const handleSubcategoryChange = (selected: Array<{ value: string; title: string }>) => {
    if (Array.isArray(selected) && selected.length > 0) {
      handleInputChange('subcategory')(selected[0].value || '');
    }
  };

  const availableSubcategories = formData.category
    ? subcategoryOptions[formData.category] || []
    : [];

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>

        <div className={styles.avatarSection}>
          <AvatarPicker
            onAvatarChange={handleInputChange('avatar')}
            initialAvatarUrl={null}
            size={100}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Имя</label>
          <InputUI
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Введите ваше имя"
            error={errors.name}
          />
        </div>

        <div className={styles.rowSection}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Дата рождения</label>
            <div className={styles.datePickerWrapper}>
              <DatePickerUI
                value={formData.birthDate}
                onChange={handleInputChange('birthDate')}
                placeholder="ДД.ММ.ГГГГ"
                error={errors.birthDate}
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
                selected={genderOptions.filter(opt => opt.value === formData.gender)}
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
              selected={cityOptions.filter(opt => opt.value === formData.city)}
              onChange={handleCityChange}
              placeholder="Не указан"
            />
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Категория навыка, которому хотите научиться</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={categoryOptions}
              selected={categoryOptions.filter(opt => opt.value === formData.category)}
              onChange={handleCategoryChange}
              placeholder="Выберите категорию"
            />
          </div>
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Подкатегория навыка, которому хотите научиться</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={availableSubcategories}
              selected={availableSubcategories.filter(opt => opt.value === formData.subcategory)}
              onChange={handleSubcategoryChange}
              placeholder="Выберите подкатегорию"
              disabled={!formData.category}
            />
          </div>
          {errors.subcategory && <span className={styles.errorText}>{errors.subcategory}</span>}
        </div>

        <div className={styles.buttonsSection}>
          <div className={styles.buttons}>
            <Button
              type="default"
              title="Назад"
              onClick={onBack}
              className={styles.backButton}
            />
            <Button
              type="primary"
              title="Продолжить"
              onClick={handleSubmit}
              className={styles.submitButton}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SecondStepForm;