import type { Category, Exchange, Subcategory } from '@shared/types'
import { useSelector } from '@app/store'
import categoryApi from '@entities/category/api/categoriesApi'
import cityApi from '@entities/city/api/citiesApi'
import { selectSkillById } from '@entities/skill'
import { selectUserById } from '@entities/user'
import { useExchangesApi } from '@features/exchanges'
import { calculateAge, formatRelativeDate, getAgeSuffix, getDaysLabel } from '@shared/lib/date'
import { getCategoryColorBySubcategoryId } from '@shared/lib/utils'
import Button from '@shared/ui/button/Button'
import { SkillTagUI } from '@shared/ui/skill-tag'
import cn from 'classnames'
import { differenceInDays } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import styles from './exchange-card.module.scss'

interface ExchangeCardProps {
  exchange: Exchange
  currentUserId: number
}

interface SkillDisplayData {
  title: string
  color: string
  categoryName: string
  subcategoryName: string
}

export default function ExchangeCard({ exchange, currentUserId }: ExchangeCardProps) {
  const { completeExchange, cancelExchange } = useExchangesApi()

  // Get both skills from exchange
  const [skill1Id, skill2Id] = exchange.skills
  const skill1 = useSelector((state) => selectSkillById(state, skill1Id))
  const skill2 = useSelector((state) => selectSkillById(state, skill2Id))

  // Determine which skill belongs to current user (teaching) and which to partner (learning)
  const mySkill = skill1?.userId === currentUserId ? skill1 : skill2
  const partnerSkill = skill1?.userId === currentUserId ? skill2 : skill1

  // Get partner user data
  const partnerId = partnerSkill?.userId
  const partnerUser = useSelector((state) =>
    partnerId ? selectUserById(state, partnerId) : undefined,
  )

  const [cityName, setCityName] = useState<string>('')
  const [categoriesData, setCategoriesData] = useState<{
    categories: Category[]
    subcategories: Subcategory[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        const [citiesData, catData] = await Promise.all([
          cityApi.getCities(),
          categoryApi.getAll(),
        ])

        setCategoriesData(catData)

        if (partnerUser?.cityId) {
          const city = citiesData.find((c) => c.id === partnerUser.cityId)
          if (city)
            setCityName(city.name)
        }
      } catch {
        // Error loading data
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [partnerUser?.cityId])

  // Helper to get skill display data
  const getSkillDisplayData = useMemo(() => {
    return (subcategoryId: number, title: string): SkillDisplayData => {
      if (!categoriesData) {
        return { title, color: '#EEE7F7', categoryName: '', subcategoryName: '' }
      }

      const { categories, subcategories } = categoriesData
      const subcategory = subcategories.find((sub) => sub.id === subcategoryId)
      const category = subcategory
        ? categories.find((cat) => cat.id === subcategory.categoryId)
        : undefined
      const color = getCategoryColorBySubcategoryId(subcategoryId, categories, subcategories)

      return {
        title,
        color,
        categoryName: category?.name || '',
        subcategoryName: subcategory?.name || '',
      }
    }
  }, [categoriesData])

  const mySkillData = useMemo(() => {
    if (!mySkill)
      return null
    return getSkillDisplayData(mySkill.subcategoryId, mySkill.title)
  }, [mySkill, getSkillDisplayData])

  const partnerSkillData = useMemo(() => {
    if (!partnerSkill)
      return null
    return getSkillDisplayData(partnerSkill.subcategoryId, partnerSkill.title)
  }, [partnerSkill, getSkillDisplayData])

  const handleComplete = () => {
    completeExchange(exchange.id)
  }

  const handleCancel = () => {
    cancelExchange(exchange.id)
  }

  const getStatusLabel = (status: Exchange['status']) => {
    switch (status) {
      case 'inProgress':
        return 'В процессе'
      case 'completed':
        return 'Обмен завершён'
      case 'cancelled':
        return 'Обмен отменён'
      default:
        return status
    }
  }

  if (isLoading || !partnerUser || !mySkill || !partnerSkill || !mySkillData || !partnerSkillData) {
    return (
      <div className={styles.card} data-exchange-id={exchange.id}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    )
  }

  const userAge = calculateAge(partnerUser.dateOfBirth)
  const userLocation = `${cityName}${userAge ? `, ${userAge} ${getAgeSuffix(userAge)}` : ''}`
  const relativeCreatedDate = formatRelativeDate(new Date(exchange.createdAt))
  const isArchived = exchange.status === 'completed' || exchange.status === 'cancelled'

  // Calculate duration for archived exchanges
  const exchangeDurationDays = exchange.completedAt
    ? differenceInDays(new Date(exchange.completedAt), new Date(exchange.createdAt))
    : 0
  const relativeCompletedDate = exchange.completedAt
    ? formatRelativeDate(new Date(exchange.completedAt))
    : ''

  return (
    <div className={styles.card} data-exchange-id={exchange.id}>
      <section className={styles.userSection}>
        <div className={styles.avatarBlock}>
          {partnerUser.avatarUrl
            ? (
                <img src={partnerUser.avatarUrl} alt={partnerUser.name} className={styles.avatar} />
              )
            : (
                <div className={styles.avatarPlaceholder}>
                  {partnerUser.name.charAt(0).toUpperCase()}
                </div>
              )}
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{partnerUser.name}</h3>
            <p className={styles.userLocation}>{userLocation}</p>
          </div>
        </div>
        {!isArchived && (
          <p className={styles.dateBadge}>
            Обмен начат:
            {' '}
            <span>{relativeCreatedDate}</span>
          </p>
        )}
        {isArchived && exchange.completedAt && (
          <p className={styles.dateBadge}>
            Обмен закончен:
            {' '}
            <span>
              {relativeCompletedDate}
              {exchangeDurationDays > 0
                && ` (${exchangeDurationDays} ${getDaysLabel(exchangeDurationDays)})`}
            </span>
          </p>
        )}
      </section>

      <section className={styles.contentSection}>
        <div className={styles.skillInfo}>
          <h4 className={styles.skillHeader}>Вы учите</h4>
          <SkillTagUI className={styles.tag} bgColor={mySkillData.color} text={mySkillData.title} />
          <p className={styles.skillCategory}>
            {mySkillData.categoryName}
            {' '}
            /
            {mySkillData.subcategoryName}
          </p>
        </div>

        <div className={styles.exchangeSection}>
          <h4 className={styles.skillHeader}>Вы изучаете</h4>
          <SkillTagUI
            className={styles.tag}
            bgColor={partnerSkillData.color}
            text={partnerSkillData.title}
          />
          <p className={styles.skillCategory}>
            {partnerSkillData.categoryName}
            {' '}
            /
            {partnerSkillData.subcategoryName}
          </p>
        </div>

        <div className={styles.actions}>
          {exchange.status === 'inProgress'
            ? (
                <>
                  <Button
                    className={styles.actionButton}
                    title="Отменить"
                    variant="secondary"
                    onClick={handleCancel}
                  />
                  <Button
                    className={styles.actionButton}
                    title="Завершить обмен"
                    variant="primary"
                    onClick={handleComplete}
                  />
                </>
              )
            : (
                <div
                  className={cn(styles.statusBadge, {
                    [styles.statusCompleted]: exchange.status === 'completed',
                    [styles.statusCancelled]: exchange.status === 'cancelled',
                  })}
                >
                  {getStatusLabel(exchange.status)}
                </div>
              )}
        </div>
      </section>
    </div>
  )
}
