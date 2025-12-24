import { useDispatch, useSelector } from '@app/store'
import {
  addFavoriteSkill,
  removeFavoriteSkill,
  selectFavoriteSkillIdsByUserId,
  selectIsSkillLikedByUser,
} from '@entities/favorites'
import { useAuthState } from '@features/auth'
import { useCallback } from 'react'

// 1. Хук только для действий (вообще не вызывает ререндеров)
export function useFavoritesActions() {
  const dispatch = useDispatch()
  const { currentUser } = useAuthState()
  const userId = currentUser?.id

  const toggleFavorite = useCallback(
    (skillId: number, isCurrentlyLiked: boolean) => {
      if (!userId)
        return

      if (isCurrentlyLiked) {
        dispatch(removeFavoriteSkill({ skillId, userId }))
      } else {
        dispatch(addFavoriteSkill({ skillId, userId }))
      }
    },
    [dispatch, userId],
  )

  return { toggleFavorite }
}

export function useIsFavorite(skillId: number) {
  const { currentUser } = useAuthState()
  const userId = currentUser?.id

  const isLiked = useSelector((state) =>
    userId ? selectIsSkillLikedByUser(state, skillId, userId) : false,
  )

  return isLiked
}

export function useFavoriteSkills() {
  const { currentUser } = useAuthState()
  const userId = currentUser?.id

  const favoriteSkillIds = useSelector((state) => {
    if (!userId)
      return []
    return selectFavoriteSkillIdsByUserId(state, userId)
  })

  return favoriteSkillIds
}
