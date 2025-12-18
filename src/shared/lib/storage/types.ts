import type { User, Skill, Request, Exchange, Notification } from '../../types';
/**
 * Типы для Delta Storage
 */

// Пользователь с хэшем пароля (только в storage)
export type StoredUser = User & {
  passwordHash: string;
};

// Навык с ID изображений
export type StoredSkill = Skill;

// Заявка на обмен (структура совпадает с Request)
export type StoredRequest = Request;

// Обмен (структура совпадает с Exchange)
export type StoredExchange = Exchange;

// Уведомление
export type StoredNotification = Notification;

// Избранное
export interface StoredFavorite {
  userId: number;
  skillId: number;
  createdAt: string;
}
