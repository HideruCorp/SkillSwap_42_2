import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import type { Gender } from '@shared/types';
import DeltaStorage from './deltaStorage';
import type {
  StoredUser,
  StoredSkill,
  StoredRequest,
  StoredExchange,
  StoredNotification,
} from './types';

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

interface NotificationPayload {
  id: number;
  userId: number;
  fromUserId: number;
  action: 'accept' | 'offer';
  createdDate: string;
  readed: boolean;
  requestId?: number;
}

type ActionWithPayloadAndMeta = UnknownAction & {
  payload?: unknown;
  meta?: unknown;
};

/**
 * Обработчики для персистенции разных actions
 */
const persistHandlers: Record<string, (action: ActionWithPayloadAndMeta) => Promise<void>> = {
  // ==================== USERS ====================

  /**
   * Теперь users/addUser действительно добавляет пользователя в IndexedDB.
   * passwordHash берём из action.meta.passwordHash.
   */
  'users/addUser': async (action) => {
    const user = action.payload as UserPayload;
    const meta = action.meta as { passwordHash?: string } | undefined;
    const passwordHash = meta?.passwordHash;

    if (!user) {
      // eslint-disable-next-line no-console
      console.warn('[persistMiddleware] users/addUser skipped: empty payload');
      return;
    }

    if (!passwordHash) {
      // eslint-disable-next-line no-console
      console.warn(
        `[persistMiddleware] users/addUser skipped: passwordHash missing for userId=${user.id}`
      );
      return;
    }

    const storedUser: StoredUser = {
      ...user,
      gender: user.gender as Gender,
      email: user.email.toLowerCase(),
      passwordHash,
    };

    await DeltaStorage.addUser(storedUser);
  },

  'users/updateUser': async (action) => {
    const { id, changes } = action.payload as UpdatePayload<UserPayload>;
    await DeltaStorage.updateUser(id, changes as Partial<StoredUser>);
  },

  'users/deleteUser': async (action) => {
    const id = action.payload as number;
    await DeltaStorage.deleteUser(id);
  },

  // ==================== SKILLS ====================

  'skills/addSkill': async (action) => {
    const skill = action.payload as SkillPayload;
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

  'skills/updateSkill': async (action) => {
    const { id, changes } = action.payload as UpdatePayload<SkillPayload>;
    await DeltaStorage.updateSkill(id, changes as Partial<StoredSkill>);
  },

  'skills/deleteSkill': async (action) => {
    const id = action.payload as number;
    await DeltaStorage.deleteSkill(id);
  },

  // ==================== FAVORITES ====================

  'favorites/addFavoriteSkill': async (action) => {
    const { skillId, userId } = action.payload as FavoritePayload;
    await DeltaStorage.addFavorite(userId, skillId);
  },

  'favorites/removeFavoriteSkill': async (action) => {
    const { skillId, userId } = action.payload as FavoritePayload;
    await DeltaStorage.removeFavorite(userId, skillId);
  },

  // ==================== REQUESTS ====================

  'requests/addRequest': async (action) => {
    const request = action.payload as RequestPayload;
    const storedRequest: StoredRequest = {
      id: request.id,
      requestedSkill: request.requestedSkill,
      fromUser: request.fromUser,
      status: request.status as StoredRequest['status'],
      createdAt: request.createdAt,
    };
    await DeltaStorage.addRequest(storedRequest);
  },

  'requests/updateRequest': async (action) => {
    const { id, changes } = action.payload as UpdatePayload<RequestPayload>;
    await DeltaStorage.updateRequest(id, changes as Partial<StoredRequest>);
  },

  'requests/deleteRequest': async (action) => {
    const id = action.payload as number;
    await DeltaStorage.deleteRequest(id);
  },

  // ==================== EXCHANGES ====================

  'exchanges/addExchange': async (action) => {
    const exchange = action.payload as ExchangePayload;
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

  'exchanges/updateExchange': async (action) => {
    const { id, changes } = action.payload as UpdatePayload<ExchangePayload>;
    await DeltaStorage.updateExchange(id, changes as Partial<StoredExchange>);
  },

  'exchanges/deleteExchange': async (action) => {
    const id = action.payload as number;
    await DeltaStorage.deleteExchange(id);
  },

  // ==================== NOTIFICATIONS ====================

  'notifications/addNotification': async (action) => {
    const notification = action.payload as NotificationPayload;
    const storedNotification: StoredNotification = {
      id: notification.id,
      userId: notification.userId,
      fromUserId: notification.fromUserId,
      action: notification.action,
      createdDate: notification.createdDate,
      readed: notification.readed,
      requestId: notification.requestId,
    };
    await DeltaStorage.addNotification(storedNotification);
  },

  'notifications/updateNotification': async (action) => {
    const { id, changes } = action.payload as UpdatePayload<NotificationPayload>;
    await DeltaStorage.updateNotification(id, changes as Partial<StoredNotification>);
  },

  'notifications/deleteNotification': async (action) => {
    const id = action.payload as number;
    await DeltaStorage.deleteNotification(id);
  },

  'notifications/markAsRead': async (action) => {
    const notificationId = action.payload as number;
    const notification = await DeltaStorage.getNotificationById(notificationId);
    if (notification) {
      await DeltaStorage.updateNotification(notificationId, { readed: true });
    }
  },

  'notifications/markAllAsReadForUser': async (action) => {
    const userId = action.payload as number;
    const notifications = await DeltaStorage.getNotificationsByUserId(userId);

    await Promise.all(
      notifications
        .filter((notification) => !notification.readed)
        .map((notification) => DeltaStorage.updateNotification(notification.id, { readed: true }))
    );
  },

  'notifications/clearViewedForUser': async (action) => {
    const userId = action.payload as number;
    const notifications = await DeltaStorage.getNotificationsByUserId(userId);

    await Promise.all(
      notifications
        .filter((notification) => notification.readed)
        .map((notification) => DeltaStorage.deleteNotification(notification.id))
    );
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
  const typedAction = action as ActionWithPayloadAndMeta;
  const actionType = typedAction.type as string;

  // Пропускаем initialize actions — они не должны персиститься
  if (actionType.includes('/initialize')) {
    return result;
  }

  const handler = persistHandlers[actionType];

  if (handler && typedAction.payload !== undefined) {
    // Асинхронно сохраняем, не блокируя UI
    handler(typedAction).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(
        `[persistMiddleware] Failed to persist ${actionType} with payload ${typedAction.payload}:`,
        error
      );
    });
  }

  return result;
};

export default persistMiddleware;
