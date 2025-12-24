import type { CategoriesResponse, Category, Subcategory } from '@shared/types'
import memoizeRequest from '@shared/lib/api/memoizeRequest'

interface CategoriesData {
  categories: Category[]
  subcategories: Subcategory[]
}

async function fetchCategoriesInternal(): Promise<CategoriesData> {
  const response = await fetch('/db/category.json')
  if (!response.ok)
    throw new Error('Failed to fetch categories')
  const data: CategoriesResponse = await response.json()
  return {
    categories: data.categories,
    subcategories: data.subcategories,
  }
}

// Создаем инстанс кэша
const getCachedCategories = memoizeRequest(fetchCategoriesInternal)

const categoryApi = {
  getAll: getCachedCategories,

  // Геттеры работают с кэшем
  getCategories: async () => (await getCachedCategories()).categories,
  getSubcategories: async () => (await getCachedCategories()).subcategories,
}

export default categoryApi
