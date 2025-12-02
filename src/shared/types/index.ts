// Типы для навыков
export interface Skill {
  id: number;
  subcategoryId: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  images: string[];
  likesReceived: number[];
}

// Типы для пользователей
export type Gender = 'male' | 'female';

export interface User {
  id: number;
  avatarUrl: string;
  name: string;
  email: string;
  about: string;
  cityId: number;
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
  id: number;
  name: string;
}

// Типы для заявок на обмен (для localStorage)
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export interface Request {
  id: string;
  skillId: number;
  fromUserId: number;
  toUserId: number;
  status: RequestStatus;
  createdAt: string;
  completedAt?: string;
}

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

