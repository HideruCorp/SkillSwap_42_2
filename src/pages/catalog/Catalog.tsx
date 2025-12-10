import FiltersPanel from '@widgets/filters-panel';
import InfiniteScroll from '@/features/infinite-scroll/InfiniteScroll';
import './Catalog.scss';
import FilterBar from '@widgets/filter-bar';

export function Catalog() {
  return (
    <>
      <FiltersPanel />

      <div className="catalog__content">
        <FilterBar />
        <InfiniteScroll />
      </div>
    </>
  );
}

export default Catalog;
