/**
 * Генерирует уникальный числовой ID на основе timestamp и случайного числа
 * @returns Уникальный числовой идентификатор
 */
export default function generateNumericId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

type RawCategory = {
  id: number;
  name: string;
  color: string;
};

type RawSubcategory = {
  id: number;
  name: string;
  categoryId: number;
};

export const getCategoryColorBySubcategoryId = (
  subcategoryId: number,
  categories: RawCategory[],
  subcategories: RawSubcategory[]
): string => {
  const subcategory = subcategories.find((sc) => sc.id === subcategoryId);
  if (!subcategory) return '#EEE7F7';

  const category = categories.find((c) => c.id === subcategory.categoryId);
  return category?.color || '#EEE7F7';
};

export const getAgeSuffix = (years: number): string => {
  if (years % 10 === 1 && years % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года';
  return 'лет';
};
