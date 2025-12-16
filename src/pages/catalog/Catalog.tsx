import { useMemo } from 'react';
import FiltersPanel from '@widgets/filters-panel';
import InfiniteScroll from '@features/infinite-scroll/InfiniteScroll';
import './Catalog.scss';
import FilterBar from '@widgets/filter-bar';
import { CardsBlock } from './CardsBlock';
import UsersSection from '@widgets/users-section/UsersSection';
import { useSelector } from '@app/store';

export function Catalog() {
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
      <FiltersPanel />

      <div className="catalog__content">
        {hasActiveFilters ? (
          <>
            <div className="catalog__controls">
              <FilterBar />
            </div>
            <UsersSection
              title="Подходящие предложения"
              mode="all"
              infinite
              previewLimit={20}
              showCount
              showSortButton
            />
          </>
        ) : (
          <>
            <CardsBlock title="ПОПУЛЯРНОЕ" startIndex={0} />
            <CardsBlock title="НОВОЕ" startIndex={3} />
            <CardsBlock title="РЕКОМЕНДУЕМ" startIndex={6} showButton={false} />
            <InfiniteScroll />
          </>
        )}
      </div>
    </>
  );
}

export default Catalog;