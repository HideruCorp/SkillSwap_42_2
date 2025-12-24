export interface RawUser {
  id: number | string
  avatarUrl?: string | null
  name?: string
  about?: string
  cityId?: number
  dateOfBirth?: string
  skillInterests?: number[]
}

export interface RawSkill {
  id: number
  subcategoryId?: number
  userId: number
  title: string
  likesReceived: number[] // DEPRECATED: используется только для миграции в favorites
}

export interface RawCity { id: number, name: string }
export interface RawCategory { id: number, name: string, color: string }
export interface RawSubcategory { id: number, name: string, categoryId: number }
export interface RawCategoriesJson {
  categories: RawCategory[]
  subcategories: RawSubcategory[]
}
