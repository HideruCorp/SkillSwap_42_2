import FiltersPanel from '@widgets/filters-panel';
import InfiniteScroll from '@features/infinite-scroll/components/InfiniteScroll';
import './Catalog.scss';

export const Catalog = () => {
  return (
    <>
      <FiltersPanel />

      <div className="catalog__content">
        <InfiniteScroll />
      </div>
    </>
  );
};

export default Catalog;
