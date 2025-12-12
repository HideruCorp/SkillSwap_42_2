import type { User, Skill } from '@shared/types';
import DeltaStorage from './deltaStorage';
import { loadMergedData } from './dataMerger';

export interface InitResult {
  users: User[];
  skills: Skill[];
}

/**
 * Инициализация данных приложения
 */
export async function initializeAppData(): Promise<InitResult> {
  // Инициализируем IndexedDB
  await DeltaStorage.init();

  // Загружаем и мержим данные
  const { users, skills } = await loadMergedData();

  // Логируем статистику в dev режиме
  if (import.meta.env.DEV) {
    const stats = await DeltaStorage.getStats();
    console.log('📊 Storage stats:', stats);
  }

  return { users, skills };
}

/**
 * Полный сброс данных
 */
export async function resetAllData(): Promise<void> {
  await DeltaStorage.clearAll();
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('currentUserId');
}
