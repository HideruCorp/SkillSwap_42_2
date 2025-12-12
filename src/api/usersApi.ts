import type { User, UsersResponse } from '@shared/types';

/**
 * Загружает всех пользователей из JSON файла
 * @returns Promise с массивом пользователей
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/db/users.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    const data: UsersResponse = await response.json();
    return data.users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading users: ${error.message}`);
    }
    throw new Error('Unknown error occurred while loading users');
  }
};

/**
 * Загружает пользователя по ID
 * @param id - ID пользователя
 * @returns Promise с пользователем или null, если не найден
 */
export const fetchUserById = async (id: number): Promise<User | null> => {
  try {
    const users = await fetchUsers();
    const user = users.find((u) => u.id === id);
    return user || null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading user by id: ${error.message}`);
    }
    throw new Error('Unknown error occurred while loading user by id');
  }
};

/**
 * usersApi — отдаёт полностью весь массив
 */
export const usersApi = {
  getUsers: async () => {
    return fetchUsers(); // просто возвращаем всех пользователей
  },
  getUserById: fetchUserById,
};

