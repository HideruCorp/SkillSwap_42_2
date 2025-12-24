import { useSelector } from '@app/store'
import { selectSkillLikesCount } from '@entities/favorites'
import { useAuthState } from '@features/auth'
import { useFavoritesActions, useIsFavorite } from '@features/favorites'
import LikeActiveIcon from '@shared/assets/img/like-Active.svg?react'
import LikeDefaultIcon from '@shared/assets/img/like-Default.svg?react'
import { memo } from 'react'
import styles from './LikeButton.module.scss'

interface Props {
  skillId: number
  className?: string
}

const LikeButton = memo(({ skillId, className }: Props) => {
  const { currentUser } = useAuthState()
  const isFavorite = useIsFavorite(skillId)
  const { toggleFavorite } = useFavoritesActions()

  // Subscribe only to likes count, not entire skill object
  // This prevents rerenders when other skill properties change
  const likesCount = useSelector((state) => selectSkillLikesCount(state, skillId))

  // Early return - не показываем кнопку неавторизованным
  if (!currentUser) {
    return null
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleFavorite(skillId, isFavorite)
  }

  return (
    <div className={styles.blockCountLikes}>
      <p className={styles.countLikes}>{likesCount}</p>
      <button
        type="button"
        className={`${styles.likeButton} ${isFavorite ? styles.active : ''} ${className}`}
        onClick={handleLike}
        aria-label={isFavorite ? 'Убрать лайк' : 'Поставить лайк'}
      >
        {isFavorite
          ? (
              <LikeActiveIcon className={styles.likeIcon} />
            )
          : (
              <LikeDefaultIcon className={styles.likeIcon} />
            )}
      </button>
    </div>
  )
})

LikeButton.displayName = 'LikeButton'

export default LikeButton
