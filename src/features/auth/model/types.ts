import type { CityId, Gender, Nullable, SubcategoryId } from '@shared/types';
import type { User } from '@entities/user';
import type { CreateSkillDTO } from '@entities/skill';

// ============ AUTH TOKENS ============

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ============ LOGIN ============

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

// ============ REGISTRATION ============

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

// Данные каждого шага wizard
export interface StepCredentials {
  email: string;
  password: string;
}

export interface StepUserData {
  name: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender: Gender;
  cityId: Nullable<CityId>;
  skillInterests: SubcategoryId[];
}

export interface StepSkillData {
  skillTitle: string;
  skillSubcategoryId: Nullable<SubcategoryId>;
  skillDescription: string;
  skillImages: string[];
}

export interface RegistrationFormData {
  credentials: StepCredentials;
  user: StepUserData;
  skill: StepSkillData;
}

export type RegistrationStep = 1 | 2 | 3;

// Запрос на сервер (формируется из всех шагов)
export interface RegisterRequest {
  // User data
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: Gender;
  cityId: number;
  skillInterests: number[];
  // Skill data
  skill: CreateSkillDTO;
}

export interface RegisterResponse {
  tokens: AuthTokens;
  user: User;
  skillId: number;
}

// ============ AUTH STATE ============

export interface AuthState {
  tokens: Nullable<AuthTokens>;
  currentUserId: number | null;
  checked: boolean; // bootstrap завершён
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Nullable<string>;
  registerError: Nullable<string>;
}

export interface RegistrationState {
  currentStep: RegistrationStep;
  formData: RegistrationFormData;
  isSubmitting: boolean;
  error: Nullable<string>;
  isCompleted: boolean;
}

// ============ VALIDATION ERRORS ============

export interface StepCredentialsErrors {
  email?: string;
  password?: string;
}

export interface StepUserDataErrors {
  name?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  cityId?: string;
  skillInterests?: string;
}

export interface StepSkillDataErrors {
  skillTitle?: string;
  skillSubcategoryId?: string;
  skillDescription?: string;
  skillImages?: string;
}

export type StepValidationErrors = StepCredentialsErrors | StepUserDataErrors | StepSkillDataErrors;

export interface RegistrationStepErrors {
  1: Nullable<StepCredentialsErrors>;
  2: Nullable<StepUserDataErrors>;
  3: Nullable<StepSkillDataErrors>;
}
