import FiltersPanel from '@widgets/filters-panel';
import InfiniteScroll from '@features/infinite-scroll/components/InfiniteScroll';
import './Catalog.scss';
import FilterBar from '@widgets/filter-bar';
import { CardsBlock } from './CardsBlock';

export function Catalog() {
  return (
    <>
      <FiltersPanel />

      <div className="catalog__content">
        <FilterBar />
        <CardsBlock title="ПОПУЛЯРНОЕ" startIndex={0} />
        <CardsBlock title="НОВОЕ" startIndex={3} />
        <CardsBlock title="РЕКОМЕНДУЕМ" startIndex={6} showButton={false} />
        <InfiniteScroll />
      </div>
    </>
  );
}

export default Catalog;