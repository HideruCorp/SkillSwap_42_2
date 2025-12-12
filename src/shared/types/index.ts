// Базовые утилитарные типы
export type Nullable<T> = T | null;

// ID типы для type-safety
export type UserId = number;
export type SkillId = number;
export type CityId = number;
export type CategoryId = number;
export type SubcategoryId = number;
export type NotificationId = number;
export type RequestId = number;
export type ExchangeId = number;

// Типы для навыков
export interface Skill {
  id: SkillId;
  subcategoryId: SubcategoryId;
  userId: UserId;
  title: string;
  description: string;
  createdAt: string;
  images: string[];
  likesReceived: number[];
}

// Тип навыка для фильтра
export type TSkillType = 'all' | 'learn' | 'teach';

// Типы для пользователей
export type Gender = 'all' | 'male' | 'female';

export interface User {
  id: UserId;
  avatarUrl: string;
  name: string;
  email: string;
  about: string;
  cityId: CityId;
  dateOfBirth: string;
  gender: Gender;
  registrationDate: string;
  skillInterests: number[];
}

// Типы для категорий
export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

// Типы для городов
export interface City {
  id: CityId;
  name: string;
}

// Типы для заявок на обмен (для localStorage)
export interface Request {
  id: RequestId;
  requestedSkill: SkillId;
  fromUser: UserId;
  status: RequestStatus;
  createdAt: string;
}

export interface Exchange {
  id: ExchangeId;
  requestId: RequestId;
  skills: [SkillId, SkillId]; // навыки обоих участников
  status: ExchangeStatus;
  createdAt: string;
  completedAt?: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type ExchangeStatus = 'inProgress' | 'completed' | 'cancelled';

// Типы для ответов API (обертки JSON)
export interface SkillsResponse {
  skills: Skill[];
}

export interface UsersResponse {
  users: User[];
}

export interface CategoriesResponse {
  categories: Category[];
  subcategories: Subcategory[];
}

export interface CitiesResponse {
  cities: City[];
}
