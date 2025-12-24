import type { Category, City, Subcategory } from '@shared/types'
import type { UserDataFormErrors, UserDataFormValues } from '@widgets/forms/user-data-form'
import categoryApi from '@entities/category/api/categoriesApi'
import cityApi from '@entities/city/api/citiesApi'
import { useStepUserData } from '@features/auth'
import { compressImage } from '@shared/lib/image/compressImage'
import UserDataForm from '@widgets/forms/user-data-form'
import { useCallback, useEffect, useMemo, useState } from 'react'

function UserDataStep() {
  const {
    userData,
    errors: storeErrors,
    isSubmitting,
    updateUserData,
    submitStep,
    prevStep,
    clearErrors,
  } = useStepUserData()

  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [citiesData, categoriesData] = await Promise.all([
          cityApi.getCities(),
          categoryApi.getAll(),
        ])
        setCities(citiesData)
        setCategories(categoriesData.categories)
        setSubcategories(categoriesData.subcategories)
      } catch (e) {
        console.error('Ошибка при загрузке данных шага 2:', e)
      }
    }

    load()
  }, [])

  const externalErrors: UserDataFormErrors | undefined = useMemo(() => {
    if (!storeErrors)
      return undefined

    return {
      name: storeErrors.name,
      avatarUrl: storeErrors.avatarUrl,
      dateOfBirth: storeErrors.dateOfBirth,
      gender: storeErrors.gender,
      cityId: storeErrors.cityId,
      skillInterests: storeErrors.skillInterests,
    }
  }, [storeErrors])

  const handleChange = useCallback(
    (patch: Partial<UserDataFormValues>) => {
      if (storeErrors)
        clearErrors()
      updateUserData(patch)
    },
    [storeErrors, clearErrors, updateUserData],
  )

  const handleAvatarChange = useCallback(
    async (file: File | null) => {
      if (storeErrors)
        clearErrors()

      if (!file) {
        updateUserData({ avatarUrl: '' })
        return
      }

      try {
        const avatarUrl = await compressImage(file)
        updateUserData({ avatarUrl })
      } catch (e) {
        console.error('Ошибка при обработке аватара:', e)
      }
    },
    [storeErrors, clearErrors, updateUserData],
  )

  const handleSubmit = useCallback(async () => {
    await submitStep()
    // currentStep переключится на 3 внутри registrationSlice при успехе
  }, [submitStep])

  return (
    <UserDataForm
      values={userData}
      cities={cities}
      categories={categories}
      subcategories={subcategories}
      isSubmitting={isSubmitting}
      externalErrors={externalErrors}
      onChange={handleChange}
      onAvatarChange={handleAvatarChange}
      onPrev={prevStep}
      onSubmit={handleSubmit}
    />
  )
}

export default UserDataStep
export { UserDataStep }
