import type { User, UsersResponse } from '@shared/types';
import type { StoredUser } from '@shared/lib/storage/types';
import memoizeRequest from '@shared/lib/api/memoizeRequest';

const fetchUsersInternal = async (): Promise<User[]> => {
  const response = await fetch('/db/users.json');
  if (!response.ok) throw new Error('Failed to fetch users');
  const data: UsersResponse = await response.json();
  return data.users;
};

// Внутренняя функция для получения полных данных с passwordHash
const fetchStoredUsersInternal = memoizeRequest(async (): Promise<StoredUser[]> => {
  const response = await fetch('/db/users.json');
  if (!response.ok) throw new Error('Failed to fetch users');
  const data: any = await response.json();
  return data.users;
});

// Экспортируем мемоизированную версию
const usersApi = {
  getUsers: memoizeRequest(fetchUsersInternal),
  // getUserById теперь использует кэшированные данные, не делая новый запрос
  getUserById: async (id: number): Promise<User | null> => {
    const users = await usersApi.getUsers();
    return users.find((u) => u.id === id) || null;
  },
  // Получить StoredUser по email (с passwordHash) - для авторизации
  getStoredUserByEmail: async (email: string): Promise<StoredUser | null> => {
    const users = await fetchStoredUsersInternal();
    const normalizedEmail = email.toLowerCase();
    return users.find((u) => u.email?.toLowerCase() === normalizedEmail) || null;
  },
};

export default usersApi;
