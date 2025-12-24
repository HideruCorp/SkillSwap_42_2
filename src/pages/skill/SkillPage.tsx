import type { Category, City, Subcategory } from '@shared/types'
import type { SkillTag } from '@shared/ui/skill-tag-list/type'
import { useSelector } from '@app/store'
import { selectOutgoingPendingRequests } from '@entities/request'
import { selectAllSkills, selectSkillById } from '@entities/skill/model/skillsSlice'
import { selectAllUsers, selectUserById } from '@entities/user'
import { useAuthState } from '@features/auth'
import { useFavoritesActions, useIsFavorite } from '@features/favorites'
import Modal from '@features/modal/Modal'
import { useRequestsApi } from '@features/requests'
import notificationIcon from '@shared/assets/img/notification-100.svg'
import userCircleIcon from '@shared/assets/img/user-circle-100.svg'
import useAuxData from '@shared/hooks/useAuxData'
import { calculateAge } from '@shared/lib/date'
import { getCategoryColorBySubcategoryId } from '@shared/lib/utils'
import SectionSimilarOffers from '@shared/ui/section-similar-offers'
import { UserSkillCard } from '@shared/ui/user-skill-card'
import ModalGatekeeper from '@widgets/modals/modal-gatekeeper'
import StatusModal from '@widgets/modals/status-modal/StatusModal'
import { Skill as SkillWidget } from '@widgets/skill'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import styles from './skill-page.module.scss'

function SkillPage() {
  const idParam = useParams<{ id: string }>()
  const skillId = Number(idParam.id)
  const isFavorite = useIsFavorite(skillId)
  const { isAuthenticated, currentUser, currentUserId } = useAuthState()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { categoriesData, citiesData } = useAuxData()
  const [isSkillCreatedModalOpen, setIsSkillCreatedModalOpen] = useState(false)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)
  const [isGatekeeperModalOpen, setIsGatekeeperModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const allSkills = useSelector(selectAllSkills)
  const allUsers = useSelector(selectAllUsers)
  const skill = useSelector((state) => selectSkillById(state, skillId))
  const skillOwner = useSelector((state) => (skill ? selectUserById(state, skill.userId) : null))
  const { createRequest } = useRequestsApi()
  const outgoingPendingRequests = useSelector((state) =>
    selectOutgoingPendingRequests(state, currentUserId ?? 1),
  )
  const toggleFavorite = useFavoritesActions()

  // Compute derived data with useMemo
  const userCardData = useMemo(() => {
    if (!skill || !skillOwner || !categoriesData || !citiesData)
      return null

    const { categories, subcategories } = categoriesData
    const userSkills = allSkills.filter((s) => s.userId === skillOwner.id)

    const canTeach: SkillTag[] = userSkills.map((userSkill) => ({
      id: String(userSkill.id),
      text: userSkill.title,
      bgColor: getCategoryColorBySubcategoryId(
        userSkill.subcategoryId || 0,
        categories,
        subcategories,
      ),
    }))

    const wantsToLearn: SkillTag[] = (skillOwner.skillInterests || [])
      .map((sid) => {
        const subcategory = subcategories.find((sc: Subcategory) => sc.id === sid)
        if (!subcategory)
          return null
        return {
          id: String(sid),
          text: subcategory.name,
          bgColor: getCategoryColorBySubcategoryId(sid, categories, subcategories),
        }
      })
      .filter((tag): tag is SkillTag => tag !== null)

    const city = citiesData.find((c: City) => c.id === skillOwner.cityId)

    return {
      name: skillOwner.name ?? 'Без имени',
      city: city?.name || 'Город не указан',
      age: calculateAge(skillOwner.dateOfBirth),
      about: skillOwner.about ?? '',
      canTeach,
      wantsToLearn,
      avatarUrl: skillOwner.avatarUrl ?? null,
    }
  }, [skill, skillOwner, categoriesData, citiesData, allSkills])

  const skillDescription = useMemo(() => {
    if (!skill || !categoriesData)
      return null

    const { categories, subcategories } = categoriesData
    const subcategory = subcategories.find((sc: Subcategory) => sc.id === skill.subcategoryId)
    const category = categories.find((c: Category) => c.id === subcategory?.categoryId)

    return {
      skillName: skill.title,
      category: category?.name || '',
      subcategory: subcategory?.name || '',
      description: skill.description,
    }
  }, [skill, categoriesData])

  useEffect(() => {
    if (searchParams.get('registerSuccess')) {
      setIsSkillCreatedModalOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const currentSkill = allSkills.find((s) => s.id === skillId)
        if (!currentSkill) {
          setError('Навык не найден')
          return
        }

        const creator = allUsers.find((s) => s.id === Number(currentSkill.userId))
        if (!creator) {
          setError('Пользователь не найден')
        }
      } catch (err) {
        if (mounted) {
          setError('Ошибка загрузки данных')
          console.error(err)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [skillId, allSkills, allUsers])

  const similarSkillIds = useMemo(() => {
    if (!skill || !categoriesData)
      return []

    const similarSkills = allSkills.filter(
      (s) => s.subcategoryId === skill.subcategoryId && s.id !== skill.id,
    )

    return similarSkills.map((s) => s.id).slice(0, 12)
  }, [allSkills, skill, categoriesData])

  const closeSkillCreatedModal = () => {
    const params = new URLSearchParams(window.location.search)
    params.delete('registerSuccess')
    setSearchParams(params)
    setIsSkillCreatedModalOpen(false)
  }

  const closeExchangeModal = () => setIsExchangeModalOpen(false)
  const closeGatekeeperModal = () => setIsGatekeeperModalOpen(false)

  if (isLoading) {
    return (
      <section className={styles.skill}>
        <p>Загрузка данных навыка...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.skill}>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </section>
    )
  }

  if (!skill || !skillDescription) {
    return <p>Загрузка...</p>
  }

  if (!skill || !userCardData || !skillDescription) {
    return (
      <section className={styles.skill}>
        <h2>Навык не найден</h2>
        <p>Запрашиваемый навык не существует.</p>
      </section>
    )
  }

  // Проверяем, является ли текущий пользователь владельцем навыка
  const isOwner = currentUser && skill ? currentUser.id === skill.userId : false

  // Проверяем, отправлялась ли уже заявка на этот навык
  const requestSent
    = currentUser && skill
      ? outgoingPendingRequests.some((request) => request.requestedSkill === skill.id)
      : false

  // Call hooks before any early returns

  // Обработчик клика по кнопке "Предложить обмен"
  const handleOfferExchange = (selectedSkillId: number) => {
    if (isAuthenticated && currentUser && skill) {
      createRequest({
        requestedSkill: selectedSkillId,
        fromUser: currentUser.id,
        toUser: skill.userId,
      })
      setIsExchangeModalOpen(true)
    } else {
      setIsGatekeeperModalOpen(true)
    }
  }

  if (isLoading) {
    return (
      <section className={styles.skill}>
        <p>Загрузка данных навыка...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.skill}>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </section>
    )
  }

  if (!skill || !skillDescription) {
    return <p>Загрузка...</p>
  }

  if (!skill || !userCardData || !skillDescription) {
    return (
      <section className={styles.skill}>
        <h2>Навык не найден</h2>
        <p>Запрашиваемый навык не существует.</p>
      </section>
    )
  }

  return (
    <>
      <div className={styles.page}>
        {/* Верхний блок: сайдбар + контент */}
        <div className={styles.mainGrid}>
          <UserSkillCard
            name={userCardData.name}
            city={userCardData.city}
            age={userCardData.age}
            about={userCardData.about}
            canTeach={userCardData.canTeach}
            wantsToLearn={userCardData.wantsToLearn}
            avatarUrl={userCardData.avatarUrl}
          />
          <SkillWidget
            skill={skill}
            skillDescription={skillDescription}
            isLiked={isFavorite}
            isOwner={isOwner} // Передаем флаг владельца
            requestSent={requestSent} // Передаем флаг отправленной заявки
            onLike={(id) => {
              toggleFavorite.toggleFavorite(id, isFavorite)
            }}
            onShare={(_id) => {
              // TODO: реализовать share через Web Share API или clipboard
            }}
            onMoreDetails={handleOfferExchange}
          />
        </div>

        {/* Similar offers section */}
        <SectionSimilarOffers
          title="Похожие предложения"
          skillIds={similarSkillIds}
          categories={categoriesData?.categories || []}
          subcategories={categoriesData?.subcategories || []}
          cities={citiesData}
          isLoading={isLoading}
        />
      </div>
      {isSkillCreatedModalOpen && (
        <Modal onClose={closeSkillCreatedModal}>
          <StatusModal
            onClose={closeSkillCreatedModal}
            icon={userCircleIcon}
            title="Ваше предложение создано"
            text="Теперь вы можете предложить обмен"
            buttonText="Готово"
          />
        </Modal>
      )}
      {isExchangeModalOpen && (
        <Modal onClose={closeExchangeModal}>
          <StatusModal
            onClose={closeExchangeModal}
            icon={notificationIcon}
            title="Вы предложили обмен"
            text="Теперь дождитесь подтверждения. Вам придёт уведомление"
            buttonText="Готово"
          />
        </Modal>
      )}
      {isGatekeeperModalOpen && (
        <Modal onClose={closeGatekeeperModal}>
          <ModalGatekeeper onClose={closeGatekeeperModal} />
        </Modal>
      )}
    </>
  )
}

export default SkillPage
