import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category, City, Gender, Subcategory } from '@shared/types';
import { InputUI } from '@shared/ui/Input';
import DatePickerUI from '@shared/ui/date-picker/DatePickerUI';
import { DropdownListUI, type OptionType } from '@shared/ui/dropdown-list';
import { AvatarPicker } from '@features/avatar-picker';
import Button from '@shared/ui/button/Button';
import styles from './user-data-form.module.scss';

export type UserDataFormValues = {
  name: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender: Gender;
  cityId: number | null;
  skillInterests: number[];
};

export type UserDataFormErrors = Partial<
  Record<'name' | 'avatarUrl' | 'dateOfBirth' | 'gender' | 'cityId' | 'skillInterests', string>
>;

export interface UserDataFormProps {
  values: UserDataFormValues;

  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];

  isSubmitting?: boolean;
  externalErrors?: UserDataFormErrors;

  onChange: (patch: Partial<UserDataFormValues>) => void;
  onAvatarChange: (file: File | null) => void;

  onPrev: () => void;
  onSubmit: () => Promise<void> | void;
}

const genderOptions: OptionType[] = [
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
  { value: 'all', title: 'Не указан' },
];

export default function UserDataForm({
  values,
  cities,
  categories,
  subcategories,
  isSubmitting = false,
  externalErrors,
  onChange,
  onAvatarChange,
  onPrev,
  onSubmit,
}: UserDataFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

  // Инициализация выбранной категории/подкатегории из values.skillInterests[0]
  useEffect(() => {
    const firstInterestId = values.skillInterests?.[0];
    if (!firstInterestId || subcategories.length === 0) {
      setSelectedSubcategoryId(null);
      return;
    }

    const sub = subcategories.find((sc) => sc.id === firstInterestId);
    if (!sub) {
      setSelectedSubcategoryId(null);
      return;
    }

    setSelectedCategoryId(sub.categoryId);
    setSelectedSubcategoryId(sub.id);
  }, [values.skillInterests, subcategories]);

  const birthDate = useMemo(() => {
    if (!values.dateOfBirth) return undefined;
    const d = new Date(values.dateOfBirth);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [values.dateOfBirth]);

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
    if (values.cityId === null) return [];
    return cityOptions.filter((opt) => opt.value === String(values.cityId));
  }, [cityOptions, values.cityId]);

  const selectedGenderOption = useMemo(
    () => genderOptions.filter((opt) => opt.value === values.gender),
    [values.gender]
  );

  const selectedCategoryOption = useMemo(() => {
    if (selectedCategoryId === null) return [];
    return categoryOptions.filter((opt) => opt.value === String(selectedCategoryId));
  }, [categoryOptions, selectedCategoryId]);

  const selectedSubcategoryOption = useMemo(() => {
    if (selectedSubcategoryId === null) return [];
    return subcategoryOptions.filter((opt) => opt.value === String(selectedSubcategoryId));
  }, [subcategoryOptions, selectedSubcategoryId]);

  const getError = useCallback(
    (key: keyof UserDataFormErrors) => externalErrors?.[key] ?? '',
    [externalErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit();
    },
    [onSubmit]
  );

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.avatarSection}>
          <AvatarPicker
            onAvatarChange={onAvatarChange}
            initialAvatarUrl={values.avatarUrl || undefined}
            size={100}
          />
          {getError('avatarUrl') && (
            <span className={styles.errorText}>{getError('avatarUrl')}</span>
          )}
        </div>

        <div className={styles.fieldWrapper}>
          <InputUI
            label="Имя"
            type="text"
            value={values.name}
            onChange={(v) => onChange({ name: v })}
            placeholder="Введите ваше имя"
            error={getError('name')}
          />
        </div>

        <div className={styles.rowSection}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Дата рождения</label>
            <div className={styles.datePickerWrapper}>
              <DatePickerUI
                value={birthDate}
                onChange={(date) => onChange({ dateOfBirth: date ? date.toISOString() : '' })}
                placeholder="ДД.ММ.ГГГГ"
                error={getError('dateOfBirth')}
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Пол</label>
            <div className={styles.dropdownWrapper}>
              <DropdownListUI
                title=""
                type="list"
                options={genderOptions}
                selected={selectedGenderOption}
                groupId="user-data-form"
                onChange={(selected) => {
                  const g = (selected?.[0]?.value as Gender | undefined) ?? 'all';
                  onChange({ gender: g });
                }}
                placeholder="Не указан"
              />
            </div>
            {getError('gender') && <span className={styles.errorText}>{getError('gender')}</span>}
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Город</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={cityOptions}
              selected={selectedCityOption}
              groupId="user-data-form"
              onChange={(selected) => {
                if (selected.length > 0) {
                  onChange({ cityId: parseInt(selected[0].value, 10) });
                } else {
                  onChange({ cityId: null });
                }
              }}
              placeholder="Выберите город"
            />
          </div>
          {getError('cityId') && <span className={styles.errorText}>{getError('cityId')}</span>}
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label}>Категория навыка, которому хотите научиться</label>
          <div className={styles.dropdownWrapper}>
            <DropdownListUI
              type="list"
              options={categoryOptions}
              selected={selectedCategoryOption}
              groupId="user-data-form"
              onChange={(selected) => {
                const categoryId = selected.length > 0 ? parseInt(selected[0].value, 10) : null;
                setSelectedCategoryId(categoryId);
                setSelectedSubcategoryId(null);
                onChange({ skillInterests: [] });
              }}
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
              groupId="user-data-form"
              onChange={(selected) => {
                if (selected.length > 0) {
                  const subId = parseInt(selected[0].value, 10);
                  setSelectedSubcategoryId(subId);
                  onChange({ skillInterests: [subId] });
                } else {
                  setSelectedSubcategoryId(null);
                  onChange({ skillInterests: [] });
                }
              }}
              placeholder={
                !selectedCategoryId ? 'Сначала выберите категорию' : 'Выберите подкатегорию'
              }
              disabled={!selectedCategoryId}
            />
          </div>
          {getError('skillInterests') && (
            <span className={styles.errorText}>{getError('skillInterests')}</span>
          )}
        </div>

        <div className={styles.buttonsSection}>
          <div className={styles.buttons}>
            <Button
              type="default"
              title="Назад"
              onClick={onPrev}
              className={styles.backButton}
              disabled={isSubmitting}
            />
            <Button
              htmlType="submit"
              type="primary"
              title={isSubmitting ? 'Обработка...' : 'Продолжить'}
              className={styles.submitButton}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
