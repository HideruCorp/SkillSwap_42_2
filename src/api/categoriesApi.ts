import type { Category, Subcategory, CategoriesResponse } from '@shared/types';

/**
 * Загружает все категории и подкатегории из JSON файла
 * @returns Promise с объектом, содержащим категории и подкатегории
 */
export const fetchCategories = async (): Promise<{
  categories: Category[];
  subcategories: Subcategory[];
}> => {
  try {
    const response = await fetch('/db/category.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const data: CategoriesResponse = await response.json();
    return {
      categories: data.categories,
      subcategories: data.subcategories,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading categories: ${error.message}`);
    }
    throw new Error('Unknown error occurred while loading categories');
  }
};

