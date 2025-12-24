import SearchIcon from '@shared/assets/img/search.svg?react'
import styles from './search-input.module.scss'

export interface SearchInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit?: (e: React.FormEvent) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  placeholder,
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <button type="submit" className={`${styles.containerButton}`} aria-label="Поиск">
        <SearchIcon />
      </button>
      <input
        type="text"
        className={`${styles.containerInput}`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder || 'Поиск по имени или навыку...'}
        aria-label="Поиск пользователей и навыков"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </form>
  )
}

export default SearchInput
