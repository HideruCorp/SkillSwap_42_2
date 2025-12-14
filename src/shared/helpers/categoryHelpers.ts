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
