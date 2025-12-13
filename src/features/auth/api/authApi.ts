import type { User } from '@entities/user';
import { hashPassword, verifyPassword } from '@shared/lib/crypto';
import type { StoredSkill, StoredUser } from '@shared/lib/storage';
import DeltaStorage, { loadStoredUserByEmail, loadUserById } from '@shared/lib/storage';
import generateNumericId from '@shared/lib/utils';
import type {
  AuthTokens,
  LoginCredentials,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../model/types';

/**
 * Генерация mock JWT токенов
 */
function generateTokens(userId: number): AuthTokens {
  const now = Date.now();
  const randomPart = Math.random().toString(36).slice(2);

  return {
    accessToken: `mock_${userId}_${now}_${randomPart}`,
    refreshToken: `refresh_${userId}_${now}_${randomPart}`,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24 часа
  };
}

/**
 * StoredUser → User (убираем passwordHash)
 */
function toPublicUser(stored: StoredUser): User {
  const { passwordHash, ...user } = stored;
  return user;
}

const authApi = {
  /**
   * Вход в систему
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Имитация задержки сети
    await new Promise((r) => {
      setTimeout(r, 500);
    });

    const stored = await loadStoredUserByEmail(credentials.email);

    if (!stored) {
      throw new Error('Пользователь с таким email не найден');
    }

    const isValid = await verifyPassword(credentials.password, stored.passwordHash);

    if (!isValid) {
      throw new Error('Неверный пароль');
    }

    return {
      tokens: generateTokens(stored.id),
      user: toPublicUser(stored),
    };
  },

  /**
   * Регистрация (все данные приходят с 3-го шага wizard)
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    await new Promise((r) => {
      setTimeout(r, 500);
    });

    // Проверяем email
    const existing = await DeltaStorage.getUserByEmail(data.email);
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Хэшируем пароль
    const passwordHash = await hashPassword(data.password);

    // Генерируем ID
    const userId = generateNumericId();
    const skillId = generateNumericId();

    // Создаём пользователя
    const storedUser: StoredUser = {
      id: userId,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      about: '',
      avatarUrl: data.avatarUrl || '', // Пустой или Data URL если загрузили
      cityId: data.cityId,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      registrationDate: new Date().toISOString(),
      skillInterests: data.skillInterests,
    };

    // Создаём навык (images уже Data URLs после сжатия)
    const storedSkill: StoredSkill = {
      id: skillId,
      subcategoryId: data.skill.subcategoryId,
      userId,
      title: data.skill.title,
      description: data.skill.description,
      createdAt: new Date().toISOString(),
      images: data.skill.images, // Data URL строки
      likesReceived: [],
    };

    // Сохраняем в IndexedDB
    await DeltaStorage.addUser(storedUser);
    await DeltaStorage.addSkill(storedSkill);

    return {
      tokens: generateTokens(userId),
      user: toPublicUser(storedUser),
      skillId,
    };
  },

  /**
   * Проверка email
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    const existing = await loadStoredUserByEmail(email);
    return !existing;
  },

  /**
   * Получить пользователя по ID
   */
  async getUserById(userId: number): Promise<User | null> {
    return loadUserById(userId);
  },

  /**
   * Выход
   */
  async logout(): Promise<void> {
    // Ничего не делаем на "сервере"
  },
};

export default authApi;
