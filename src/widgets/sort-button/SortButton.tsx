import { useState } from 'react';
import Dropdown from '@shared/ui/dropdown/Dropdown';
import Button from '@shared/ui/button/Button';
import { useDispatch, useSelector } from '@app/store';
import { setSortBy } from '@features/sort';
import type { SortOption } from '@features/sort';
import SortIcon from '@shared/assets/img/sort.svg?react';
import styles from './sort-button.module.scss';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'name', label: 'По имени' },
  { value: 'age', label: 'По возрасту' },
];

export function SortButton() {
  const dispatch = useDispatch();
  const currentSort = useSelector((state) => state.sort.sortBy);
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || 'Сортировка';

  const handleToggle = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
  };

  const handleSelect = (value: SortOption) => {
    dispatch(setSortBy(value));
    setIsOpen(false);
  };

  return (
    <Dropdown
      className={styles.relative}
      trigger={
        <div className={styles.button}>
          <SortIcon className={styles.sortIcon} />
          <span className={styles.buttonText}>{currentLabel}</span>
        </div>
      }
      isOpen={isOpen}
      onToggle={handleToggle}
      align="right"
      menuClassName={styles.menuContainer}
    >
      <ul className={styles.menuList}>
        {SORT_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={`${styles.menuItem} ${currentSort === option.value ? styles.menuItemActive : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}

export default SortButton;
