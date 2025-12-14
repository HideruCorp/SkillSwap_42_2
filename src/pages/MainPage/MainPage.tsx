import React, { useMemo, type JSX } from 'react';
import UsersSection from '../../widgets/users-section/UsersSection';
import InfiniteScroll from '../../features/infinite-scroll/InfiniteScroll';
import styles from './main-page.module.scss';
import { useSelector } from '../../services/store';

export default function MainPage(): JSX.Element {
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
      cities.length > 0 ||
      subcategories.length > 0 ||
      textSearch.trim() !== ''
    );
  }, [skillType, gender, cities, subcategories, textSearch]);

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        {/* Здесь фильтры - пока заглушка */}
        <div style={{ padding: 16 }}>
          <h4>Фильтры</h4>
        </div>
      </aside>

      <section className={styles.content}>
        {hasActiveFilters ? (
          // При активных фильтрах показываем секцию "Подходящие предложения"
          <UsersSection
            title="Подходящие предложения"
            mode="all"
            infinite
            previewLimit={20}
            showCount
          />
        ) : (
          // Без фильтров показываем обычные секции
          <>
            <UsersSection
              title="Популярное"
              mode="likes"
              previewLimit={3}
              infinite={false}
              showAllButton
            />

            <UsersSection
              title="Новое"
              mode="created"
              previewLimit={3}
              infinite={false}
              showAllButton
            />

            <UsersSection title="Рекомендуем" mode="created" infinite previewLimit={20} />
          </>
        )}
      </section>
    </main>
  );
}
