import type { User, Skill } from '@shared/types';
import usersApi from '@entities/user/api/usersApi'; // Импортируем из нового места
import skillsApi from '@entities/skill/api/skillsApi';
import type { StoredUser, StoredSkill } from './types';
import DeltaStorage from './deltaStorage';

/**
 * Убрать passwordHash из StoredUser → User
 */
function toPublicUser(stored: StoredUser): User {
  const { passwordHash, ...user } = stored;
  return user;
}

/**
 * StoredSkill → Skill (структуры совпадают)
 */
function toPublicSkill(stored: StoredSkill): Skill {
  return { ...stored };
}

/**
 * Слияние mock-данных с дельтами из IndexedDB
 */
export async function loadMergedData(): Promise<{
  users: User[];
  skills: Skill[];
}> {
  // 1. Загружаем mock-данные
  const [mockUsers, mockSkills] = await Promise.all([usersApi.getUsers(), skillsApi.getSkills()]);

  // 2. Загружаем дельты из IndexedDB
  const [storedUsers, storedSkills] = await Promise.all([
    DeltaStorage.getAllUsers(),
    DeltaStorage.getAllSkills(),
  ]);

  // 3. Мержим: дельты имеют приоритет над mock
  const deltaUserIds = new Set(storedUsers.map((u: StoredUser) => u.id));
  const deltaSkillIds = new Set(storedSkills.map((s: StoredSkill) => s.id));

  const mergedUsers: User[] = [
    ...mockUsers.filter((u) => !deltaUserIds.has(u.id)),
    ...storedUsers.map(toPublicUser),
  ];

  const mergedSkills: Skill[] = [
    ...mockSkills.filter((s) => !deltaSkillIds.has(s.id)),
    ...storedSkills.map(toPublicSkill),
  ];

  return { users: mergedUsers, skills: mergedSkills };
}

/**
 * Загрузить пользователя по ID (сначала IndexedDB, потом mock)
 */
export async function loadUserById(id: number): Promise<User | null> {
  // Сначала IndexedDB
  const stored = await DeltaStorage.getUserById(id);
  if (stored) {
    return toPublicUser(stored);
  }

  // Fallback на mock через API
  return usersApi.getUserById(id);
}

/**
 * Загрузить навык по ID
 */
export async function loadSkillById(id: number): Promise<Skill | null> {
  const stored = await DeltaStorage.getSkillById(id);
  if (stored) {
    return toPublicSkill(stored);
  }

  // Fallback на mock через API
  return skillsApi.getSkillById(id);
}

/**
 * Загрузить пользователя по email (сначала IndexedDB, потом mock)
 *
 * Возвращает StoredUser с passwordHash — используется ТОЛЬКО для авторизации.
 * Не дублирует usersSlice: слайс хранит публичный тип User без passwordHash,
 * а эта функция нужна для проверки пароля при логине.
 */
export async function loadStoredUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.toLowerCase();

  // Сначала IndexedDB
  const stored = await DeltaStorage.getUserByEmail(normalizedEmail);
  if (stored) {
    return stored;
  }

  // Fallback на mock через API
  return usersApi.getStoredUserByEmail(normalizedEmail);
}
