import { useMemo } from 'react';
import FiltersPanel from '@widgets/filters-panel';
import UsersSection from '@widgets/users-section/UsersSection';
import styles from './main-page.module.scss';
import FilterBar from '@widgets/filter-bar';
import { useSelector } from '../../services/store';

export function MainPage() {
  // Проверяем, есть ли активные фильтры
  const skillType = useSelector((state) => state.filters.skillType);
  const gender = useSelector((state) => state.filters.gender);
  const cities = useSelector((state) => state.filters.cities);
  const subcategories = useSelector((state) => state.filters.subcategories);
  const textSearch = useSelector((state) => state.filters.textSearch);

  const hasActiveFilters = useMemo(() => {
    return (
      skillType !== 'all' ||
      gender !== 'all' ||
      (cities && cities.length > 0) ||
      (subcategories && subcategories.length > 0) ||
      (textSearch && textSearch.trim() !== '')
    );
  }, [skillType, gender, cities, subcategories, textSearch]);

  return (
    <>
      {/* ЛЕВАЯ КОЛОНКА */}
      <aside className={styles.filters}>
        <FiltersPanel />
      </aside>

      {/* ПРАВАЯ КОЛОНКА */}
      <section className={styles.content}>
        <div className={styles.controls}>
          <FilterBar />
        </div>

        {hasActiveFilters ? (
          <UsersSection
            title="Подходящие предложения"
            mode="all"
            infinite
            previewLimit={21}
            showCount
            showSortButton
          />
        ) : (
          <>
            <div className={styles.section}>
              <UsersSection
                title="Популярное"
                mode="likes"
                previewLimit={3}
                infinite={false}
                showAllButton
              />
              </div>
            <div className={styles.section}>
              <UsersSection
                title="Новое"
                mode="created"
                previewLimit={3}
                infinite={false}
                showAllButton
              />
            </div>
            <div className={styles.section}>
              <UsersSection title="Рекомендуем" mode="created" infinite previewLimit={21} />
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default MainPage;