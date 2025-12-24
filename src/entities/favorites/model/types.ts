import type { Nullable, UserId } from '@shared/types'

/**
 * Represents a user's like/favorite of a skill
 */
export interface Favorite {
  userId: UserId
  skillId: number
  createdAt: string // ISO date string when the like was added
}

/**
 * State shape for favorites slice
 */
export interface FavoritesState {
  items: Favorite[]
  isLoading: boolean
  error: Nullable<string>
}

/**
 * Stored favorite for IndexedDB persistence
 */
export interface StoredFavorite {
  userId: UserId
  skillId: number
  createdAt: string
}
