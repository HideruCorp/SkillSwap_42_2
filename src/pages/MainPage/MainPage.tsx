import FiltersPanel from '@widgets/filters-panel';
import UsersSection from '@widgets/users-section/UsersSection';
import styles from './main-page.module.scss';
import FilterBar from '@widgets/filter-bar';
import { useActiveFilters } from '@features/filters/useActiveFilters';

export function MainPage() {
  const { hasActiveFilters } = useActiveFilters();

  return (
    <>
      {/* ЛЕВАЯ КОЛОНКА */}
      <aside className={styles.filters}>
        <FiltersPanel />
      </aside>

      {/* ПРАВАЯ КОЛОНКА */}
      <section className={styles.content}>
        {hasActiveFilters ? (
          <>
            <div className={styles.controls}>
              <FilterBar />
            </div>
            <UsersSection
              title="Подходящие предложения"
              mode="all"
              infinite
              previewLimit={21}
              showCount
              showSortButton
            />
          </>
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
