import { useSelector } from '@app/store'
import { selectAllSkills, selectSkillsLoading, SkillCardContainer } from '@entities/skill'
import { useAuthState } from '@features/auth'
import useAuxData from '@shared/hooks/useAuxData'
import Button from '@shared/ui/button/Button'
import SectionUI from '@shared/ui/section/SectionUI'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './profile-skills-page.module.scss'

/**
 * ProfileSkillsPage - страница "Мои навыки" в профиле пользователя
 * Реализует вкладку "Мои навыки" в разделе профиля
 *
 * Роут: /profile/skills
 *
 * className={styles['profile-skills__some-bem--specific']}
 */

function ProfileSkillsPage() {
  const navigate = useNavigate()
  const { currentUserId } = useAuthState()
  const allSkills = useSelector(selectAllSkills)
  const skillsLoading = useSelector(selectSkillsLoading)
  const { categoriesData, citiesData, isLoading: auxLoading } = useAuxData()

  const userSkills = useMemo(() => {
    if (!currentUserId)
      return []
    return allSkills.filter((skill) => skill.userId === currentUserId)
  }, [allSkills, currentUserId])

  const handleGoToMain = () => {
    navigate('/')
  }

  if (skillsLoading || auxLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Загрузка...</div>
      </div>
    )
  }

  const hasSkills = userSkills.length > 0

  return (
    <div className={styles.container}>
      {!hasSkills
        ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✎</div>
              <h3 className={styles.emptyTitle}>У вас пока нет навыков</h3>
              <p className={styles.emptyText}>
                Вы еще не создали ни одного навыка. Вернитесь на главную страницу, чтобы посмотреть предложения других пользователей.
              </p>
              <Button
                title="На главную"
                onClick={handleGoToMain}
                variant="primary"
                className={styles.goToMainButton}
              />
            </div>
          )
        : (
            <SectionUI title="Мои навыки" className={styles.section}>
              {userSkills.map((skill) => (
                <SkillCardContainer
                  key={skill.id}
                  skillId={skill.id}
                  categories={categoriesData?.categories || []}
                  subcategories={categoriesData?.subcategories || []}
                  cities={citiesData}
                />
              ))}
            </SectionUI>
          )}
    </div>
  )
}

export default ProfileSkillsPage
