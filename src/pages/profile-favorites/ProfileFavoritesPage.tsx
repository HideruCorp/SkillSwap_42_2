import type { Category, City, Subcategory } from '@shared/types'
import { useSelector } from '@app/store'
import categoryApi from '@entities/category/api/categoriesApi'
import cityApi from '@entities/city/api/citiesApi'
import { selectAllSkills, SkillCardContainer } from '@entities/skill'
import { useFavoriteSkills } from '@features/favorites'
import Button from '@shared/ui/button/Button'
import SectionUI from '@shared/ui/section/SectionUI'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './profile-favorites-page.module.scss'

function ProfileFavoritesPage() {
  const navigate = useNavigate()
  const allSkills = useSelector(selectAllSkills)
  const favoriteSkillIds = useFavoriteSkills()

  const [aux, setAux] = useState<{
    cities: City[]
    categories: Category[]
    subcategories: Subcategory[]
  } | null>(null)
  const [, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [citiesResponse, categoriesResponse] = await Promise.all([
          cityApi.getCities(),
          categoryApi.getAll(),
        ])
        if (!mounted)
          return
        setAux({
          cities: citiesResponse,
          categories: categoriesResponse.categories,
          subcategories: categoriesResponse.subcategories,
        })
      } catch (e) {
        console.error('Ошибка загрузки вспомогательных данных', e)
      } finally {
        if (mounted)
          setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const favoriteSkills = useMemo(() => {
    return allSkills.filter((skill) => favoriteSkillIds.includes(skill.id))
  }, [allSkills, favoriteSkillIds])

  const hasFavorites = favoriteSkills.length > 0

  const handleGoToSkills = () => {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      {!hasFavorites
        ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>♡</div>
              <h3 className={styles.emptyTitle}>Пока пусто</h3>
              <p className={styles.emptyText}>
                Нажмите на сердечко в карточке пользователя, чтобы добавить его в избранное
              </p>
              <Button
                title="Вперёд за навыками"
                onClick={handleGoToSkills}
                variant="primary"
                className={styles.goToSkillsButton}
              />
            </div>
          )
        : (
            <SectionUI title="Избранное" className={styles.section}>
              {favoriteSkills.map((skill) => (
                <SkillCardContainer
                  key={skill.id}
                  skillId={skill.id}
                  categories={aux?.categories || []}
                  subcategories={aux?.subcategories || []}
                  cities={aux?.cities || []}
                />
              ))}
            </SectionUI>
          )}
    </div>
  )
}

export default ProfileFavoritesPage
