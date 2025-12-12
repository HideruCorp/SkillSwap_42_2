import type { User, Skill, Request, Exchange } from '../../types';
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
