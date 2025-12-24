import type { CityId, Gender, SubcategoryId, User } from '@shared/types'

export type { User }

export interface UserPreview {
  id: number
  name: string
  avatarUrl: string
}

export interface CreateUserDTO {
  email: string
  password: string
  name: string
  dateOfBirth: string
  gender: Gender
  cityId: CityId
  skillInterests: SubcategoryId[]
  about?: string
  avatarUrl?: string
}

export interface UpdateUserDTO {
  name?: string
  about?: string
  avatarUrl?: string
  cityId?: CityId
  skillInterests?: SubcategoryId[]
}
