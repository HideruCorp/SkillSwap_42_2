import searchIcon from '@shared/assets/img/search.svg';
import styles from './search-input.module.scss';

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={`${styles.container}`}>
      <button type="button" className={`${styles.containerButton}`}>
        <img src={searchIcon} alt="Поиск" />
      </button>
      <input
        type="text"
        className={`${styles.containerInput}`}
        value={value}
        onChange={onChange}
        placeholder="Искать навык"
      />
    </div>
  );
}

export default SearchInput;
