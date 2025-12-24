import type { FilterItemProps, FilterType } from './type'

import CrossIcon from '@shared/assets/img/cross.svg?react'
import styles from './filter-item.module.scss'

function getDisplayText(type: FilterType, value: string): string {
  switch (type) {
    case 'searchType':
      return value
    case 'category':
      return value
    case 'gender':
      return `Пол: ${value}`
    case 'city':
      return value
    case 'name':
      return `Название: *${value}*`
    default:
      return value
  }
}

function FilterItem({ type, value, onClick }: FilterItemProps) {
  const displayText = getDisplayText(type, value)

  return (
    <button className={styles['filter-item']} onClick={onClick} type="button">
      <span>{displayText}</span>
      <span className={styles.icon}>
        <CrossIcon />
      </span>
    </button>
  )
}

export default FilterItem
