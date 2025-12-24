import type { Skill, User } from '@shared/types'
import { loadMergedData } from './dataMerger'
import DeltaStorage from './deltaStorage'

export interface InitResult {
  users: User[]
  skills: Skill[]
}

/**
 * Инициализация данных приложения
 */
export async function initializeAppData(): Promise<InitResult> {
  // Инициализируем IndexedDB
  await DeltaStorage.init()

  // Загружаем и мержим данные
  const { users, skills } = await loadMergedData()

  // Логируем статистику в dev режиме
  if (import.meta.env.DEV) {
    const stats = await DeltaStorage.getStats()
    // eslint-disable-next-line no-console
    console.log('📊 Storage stats:', stats)
  }

  return { users, skills }
}

/**
 * Полный сброс данных
 */
export async function resetAllData(): Promise<void> {
  await DeltaStorage.clearAll()
  localStorage.removeItem('auth_tokens')
  localStorage.removeItem('currentUserId')
}
