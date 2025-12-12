import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import DeltaStorage from './deltaStorage';
import type { StoredUser, StoredSkill, StoredRequest, StoredExchange } from './types';

/**
 * Типы payload для разных actions
 */
interface UserPayload {
  id: number;
  email: string;
  name: string;
  about: string;
  avatarUrl: string;
  cityId: number;
  dateOfBirth: string;
  gender: string;
  registrationDate: string;
  skillInterests: number[];
}

interface SkillPayload {
  id: number;
  subcategoryId: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  images: string[];
  likesReceived: number[];
}

interface UpdatePayload<T> {
  id: number;
  changes: Partial<T>;
}

interface FavoritePayload {
  skillId: number;
  userId: number;
}

interface RequestPayload {
  id: number;
  requestedSkill: number;
  fromUser: number;
  status: string;
  createdAt: string;
}

interface ExchangePayload {
  id: number;
  requestId: number;
  skills: [number, number];
  status: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Обработчики для персистенции разных actions
 */
const persistHandlers: Record<string, (payload: unknown) => Promise<void>> = {
  // ==================== USERS ====================

  'users/addUser': async (payload) => {
    const user = payload as UserPayload;
    // Получаем существующего пользователя с passwordHash из IndexedDB
    // (он был создан через authApi.register)
    const existing = await DeltaStorage.getUserById(user.id);
    if (!existing) {
      // Если пользователя нет (edge case), создаём без пароля
      // Это не должно происходить при нормальном flow
      console.warn('User not found in IndexedDB during persist:', user.id);
    }
  },

  'users/updateUser': async (payload) => {
    const { id, changes } = payload as UpdatePayload<UserPayload>;
    await DeltaStorage.updateUser(id, changes as Partial<StoredUser>);
  },

  'users/deleteUser': async (payload) => {
    const id = payload as number;
    await DeltaStorage.deleteUser(id);
  },

  // ==================== SKILLS ====================

  'skills/addSkill': async (payload) => {
    const skill = payload as SkillPayload;
    const storedSkill: StoredSkill = {
      id: skill.id,
      subcategoryId: skill.subcategoryId,
      userId: skill.userId,
      title: skill.title,
      description: skill.description,
      createdAt: skill.createdAt,
      images: skill.images,
      likesReceived: skill.likesReceived,
    };
    await DeltaStorage.addSkill(storedSkill);
  },

  'skills/updateSkill': async (payload) => {
    const { id, changes } = payload as UpdatePayload<SkillPayload>;
    await DeltaStorage.updateSkill(id, changes as Partial<StoredSkill>);
  },

  'skills/deleteSkill': async (payload) => {
    const id = payload as number;
    await DeltaStorage.deleteSkill(id);
  },

  // ==================== FAVORITES ====================

  'skills/addFavorite': async (payload) => {
    const { skillId, userId } = payload as FavoritePayload;
    const skill = await DeltaStorage.getSkillById(skillId);

    if (skill) {
      const newLikes = skill.likesReceived.includes(userId)
        ? skill.likesReceived
        : [...skill.likesReceived, userId];

      await DeltaStorage.updateSkill(skillId, { likesReceived: newLikes });
    }
  },

  'skills/removeFavorite': async (payload) => {
    const { skillId, userId } = payload as FavoritePayload;
    const skill = await DeltaStorage.getSkillById(skillId);

    if (skill) {
      await DeltaStorage.updateSkill(skillId, {
        likesReceived: skill.likesReceived.filter((id) => id !== userId),
      });
    }
  },

  // ==================== REQUESTS ====================

  'requests/addRequest': async (payload) => {
    const request = payload as RequestPayload;
    const storedRequest: StoredRequest = {
      id: request.id,
      requestedSkill: request.requestedSkill,
      fromUser: request.fromUser,
      status: request.status as StoredRequest['status'],
      createdAt: request.createdAt,
    };
    await DeltaStorage.addRequest(storedRequest);
  },

  'requests/updateRequest': async (payload) => {
    const { id, changes } = payload as UpdatePayload<RequestPayload>;
    await DeltaStorage.updateRequest(id, changes as Partial<StoredRequest>);
  },

  'requests/deleteRequest': async (payload) => {
    const id = payload as number;
    await DeltaStorage.deleteRequest(id);
  },

  // ==================== EXCHANGES ====================

  'exchanges/addExchange': async (payload) => {
    const exchange = payload as ExchangePayload;
    const storedExchange: StoredExchange = {
      id: exchange.id,
      requestId: exchange.requestId,
      skills: exchange.skills,
      status: exchange.status as StoredExchange['status'],
      createdAt: exchange.createdAt,
      completedAt: exchange.completedAt,
    };
    await DeltaStorage.addExchange(storedExchange);
  },

  'exchanges/updateExchange': async (payload) => {
    const { id, changes } = payload as UpdatePayload<ExchangePayload>;
    await DeltaStorage.updateExchange(id, changes as Partial<StoredExchange>);
  },

  'exchanges/deleteExchange': async (payload) => {
    const id = payload as number;
    await DeltaStorage.deleteExchange(id);
  },

  // ==================== SESSION ====================

  'session/updateUser': async (payload) => {
    // Обновление текущего пользователя
    const changes = payload as Partial<UserPayload>;
    const userId = localStorage.getItem('currentUserId');

    if (userId) {
      await DeltaStorage.updateUser(Number(userId), changes as Partial<StoredUser>);
    }
  },
};

/**
 * Redux Middleware для автоматической персистенции в IndexedDB
 *
 * Перехватывает определённые actions и асинхронно сохраняет изменения.
 * Не блокирует UI — сохранение происходит в фоне.
 */
export const persistMiddleware: Middleware = () => (next) => (action) => {
  // Сначала пропускаем action дальше
  const result = next(action);

  // Проверяем, нужно ли персистить
  const typedAction = action as UnknownAction;
  const actionType = typedAction.type as string;

  // Пропускаем initialize actions — они не должны персиститься
  if (actionType.includes('/initialize')) {
    return result;
  }

  const handler = persistHandlers[actionType];

  if (handler && typedAction.payload !== undefined) {
    // Асинхронно сохраняем, не блокируя UI
    handler(typedAction.payload).catch((error) => {
      console.error(`[persistMiddleware] Failed to persist ${actionType}:`, error);
    });
  }

  return result;
};

export default persistMiddleware;
