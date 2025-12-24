import type { CategoriesResponse, City } from '../types'
import categoryApi from '@entities/category/api/categoriesApi'
import cityApi from '@entities/city/api/citiesApi'
import { useEffect, useState } from 'react'

interface AuxData {
  categoriesData?: CategoriesResponse
  citiesData: City[]
  isLoading: boolean
  error: string | null
}

export default function useAuxData(): AuxData {
  const [categoriesData, setCategoriesData] = useState<CategoriesResponse | undefined>(undefined)
  const [citiesData, setCitiesData] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [categoriesDataRes, citiesDataRes] = await Promise.all([
          categoryApi.getAll(),
          cityApi.getCities(),
        ])

        if (!mounted)
          return

        setCategoriesData(categoriesDataRes)
        setCitiesData(citiesDataRes)
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
  }, [])

  return {
    categoriesData,
    citiesData,
    isLoading,
    error,
  }
}
