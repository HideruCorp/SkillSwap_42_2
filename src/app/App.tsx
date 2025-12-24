import { useDispatch } from '@app/store'
import { initializeExchanges } from '@entities/exchange'
import { initializeFavorites } from '@entities/favorites'
import { initializeNotifications } from '@entities/notification'
import { initializeRequests } from '@entities/request'
import { initializeSkills } from '@entities/skill/model/skillsSlice'
import { initializeUsers } from '@entities/user/model/usersSlice'
import { bootstrapAuth } from '@features/auth'
import { useThemeInit } from '@features/theme'
import DeltaStorage from '@shared/lib/storage'
import Layout from '@widgets/layout'
import { useEffect, useState } from 'react'
import AppRouter from './router'
import './App.scss'

function App() {
  // Initialize theme system (loads from localStorage/system preference)
  useThemeInit()

  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Сначала инициализируем IndexedDB
        await DeltaStorage.init()

        // Затем загружаем данные в Redux
        await Promise.all([
          dispatch(initializeUsers()),
          dispatch(initializeSkills()),
          dispatch(initializeFavorites()),
          dispatch(initializeRequests()),
          dispatch(initializeExchanges()),
          dispatch(initializeNotifications()),
        ])

        // Bootstrap auth после загрузки users (для проверки существования пользователя)
        await dispatch(bootstrapAuth())

        setIsInitialized(true)
      } catch (err) {
        console.error('Ошибка инициализации приложения:', err)
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        setIsInitialized(true) // Разрешаем рендер даже при ошибке
      }
    }

    init()
  }, [dispatch])

  if (!isInitialized) {
    return <div>Загрузка...</div>
  }

  if (error) {
    console.error('Ошибка приложения:', error)
  }

  return (
    <Layout>
      <AppRouter />
    </Layout>
  )
}

export default App
