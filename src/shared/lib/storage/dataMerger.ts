import type { User, Skill } from '@shared/types';
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
  const [mockUsersRes, mockSkillsRes] = await Promise.all([
    fetch('/db/users.json').catch(() => ({ json: () => ({ users: [] }) })),
    fetch('/db/skills.json').catch(() => ({ json: () => ({ skills: [] }) })),
  ]);

  const mockUsersData = await (mockUsersRes as Response).json();
  const mockSkillsData = await (mockSkillsRes as Response).json();

  const mockUsers: User[] = mockUsersData.users || [];
  const mockSkills: Skill[] = mockSkillsData.skills || [];

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

  // Fallback на mock
  try {
    const response = await fetch('/db/users.json');
    const data = await response.json();
    return data.users?.find((u: User) => u.id === id) || null;
  } catch {
    return null;
  }
}

/**
 * Загрузить навык по ID
 */
export async function loadSkillById(id: number): Promise<Skill | null> {
  const stored = await DeltaStorage.getSkillById(id);
  if (stored) {
    return toPublicSkill(stored);
  }

  try {
    const response = await fetch('/db/skills.json');
    const data = await response.json();
    return data.skills?.find((s: Skill) => s.id === id) || null;
  } catch {
    return null;
  }
}
