export type FilterType = 'searchType' | 'category' | 'gender' | 'city' | 'name';

export type SearchTypeValue = 'Все' | 'Хочу научиться' | 'Могу научить';
export type GenderValue = 'Не имеет значения' | 'Мужской' | 'Женский';

export interface FilterItemProps {
  type: FilterType;
  value: string;
  onClick: () => void;
}
