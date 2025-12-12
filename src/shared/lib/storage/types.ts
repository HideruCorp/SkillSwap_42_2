import type { User, Skill } from '../../types';
/**
 * Типы для Delta Storage
 */

// Пользователь с хэшем пароля (только в storage)
export type StoredUser = User & {
  passwordHash: string;
};

// Навык с ID изображений
export type StoredSkill = Skill;
