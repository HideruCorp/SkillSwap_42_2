import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Nullable } from '@shared/types';
import authApi from '../api/authApi';
import type {
  RegistrationStep,
  RegistrationFormData,
  StepCredentials,
  StepUserData,
  StepSkillData,
  StepCredentialsErrors,
  StepUserDataErrors,
  StepSkillDataErrors,
  StepValidationErrors,
  RegistrationStepErrors,
  AuthTokens,
} from './types';

// ============ TYPES ============

interface RegistrationState {
  currentStep: RegistrationStep;
  formData: RegistrationFormData;
  isSubmitting: boolean;
  isCheckingEmail: boolean;
  stepErrors: RegistrationStepErrors;
  error: Nullable<string>;
  isCompleted: boolean;
}

// ============ VALIDATION ============

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStepCredentials(credentials: StepCredentials): StepCredentialsErrors | null {
  const errors: StepCredentialsErrors = {};

  if (!credentials.email.trim()) {
    errors.email = 'Email обязателен';
  } else if (!EMAIL_REGEX.test(credentials.email)) {
    errors.email = 'Некорректный формат email';
  }

  if (!credentials.password) {
    errors.password = 'Пароль обязателен';
  } else if (credentials.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateStepUserData(userData: StepUserData): StepUserDataErrors | null {
  const errors: StepUserDataErrors = {};

  if (!userData.name.trim()) {
    errors.name = 'Имя обязательно';
  } else if (userData.name.trim().length < 2) {
    errors.name = 'Имя должно быть не менее 2 символов';
  }

  if (userData.cityId === null) {
    errors.cityId = 'Выберите город';
  }

  if (userData.gender === 'all') {
    errors.gender = 'Выберите пол';
  }

  if (!userData.dateOfBirth) {
    errors.dateOfBirth = 'Укажите дату рождения';
  }

  if (userData.skillInterests.length === 0) {
    errors.skillInterests = 'Выберите хотя бы один интерес';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateStepSkillData(skillData: StepSkillData): StepSkillDataErrors | null {
  const errors: StepSkillDataErrors = {};

  if (!skillData.skillTitle.trim()) {
    errors.skillTitle = 'Название навыка обязательно';
  } else if (skillData.skillTitle.trim().length < 3) {
    errors.skillTitle = 'Название должно быть не менее 3 символов';
  }

  if (skillData.skillSubcategoryId === null) {
    errors.skillSubcategoryId = 'Выберите категорию';
  }

  if (!skillData.skillDescription.trim()) {
    errors.skillDescription = 'Описание обязательно';
  } else if (skillData.skillDescription.trim().length < 10) {
    errors.skillDescription = 'Описание должно быть не менее 10 символов';
  }

  if (skillData.skillImages.length === 0) {
    errors.skillImages = 'Добавьте хотя бы одно изображение';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// ============ INITIAL STATE ============

const initialFormData: RegistrationFormData = {
  credentials: {
    email: '',
    password: '',
  },
  user: {
    name: '',
    avatarUrl: '',
    dateOfBirth: '',
    gender: 'all',
    cityId: null,
    skillInterests: [],
  },
  skill: {
    skillTitle: '',
    skillSubcategoryId: null,
    skillDescription: '',
    skillImages: [],
  },
};

const initialState: RegistrationState = {
  currentStep: 1,
  formData: initialFormData,
  isSubmitting: false,
  isCheckingEmail: false,
  stepErrors: {
    1: null,
    2: null,
    3: null,
  },
  error: null,
  isCompleted: false,
};

// ============ ASYNC THUNKS ============

/**
 * Проверка доступности email (для интеграции с yup в компоненте)
 */
export const checkEmailAvailability = createAsyncThunk<boolean, string, { rejectValue: string }>(
  'registration/checkEmail',
  async (email, { rejectWithValue }) => {
    try {
      const isAvailable = await authApi.checkEmailAvailability(email);
      if (!isAvailable) {
        return rejectWithValue('Этот email уже зарегистрирован');
      }
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка проверки email');
    }
  }
);

/**
 * Валидация и переход на следующий шаг
 * Возвращает { nextStep, isLastStep } при успехе
 */
export const submitStep = createAsyncThunk<
  { nextStep: RegistrationStep; isLastStep: boolean },
  RegistrationStep,
  { state: { registration: RegistrationState }; rejectValue: StepValidationErrors }
>('registration/submitStep', async (step, { getState, dispatch, rejectWithValue }) => {
  const { formData } = getState().registration;

  let errors: StepValidationErrors | null = null;

  switch (step) {
    case 2:
      errors = validateStepUserData(formData.user);
      break;
    case 3:
      errors = validateStepSkillData(formData.skill);
      break;
    default: {
      // Сначала локальная валидация
      errors = validateStepCredentials(formData.credentials);
      if (errors) {
        return rejectWithValue(errors);
      }
      // Затем проверка email через API
      const emailResult = await dispatch(checkEmailAvailability(formData.credentials.email));
      if (checkEmailAvailability.rejected.match(emailResult)) {
        return rejectWithValue({ email: emailResult.payload as string });
      }
      break;
    }
  }

  if (errors) {
    return rejectWithValue(errors);
  }

  const isLastStep = step === 3;
  const nextStep = isLastStep ? 3 : ((step + 1) as RegistrationStep);

  return { nextStep, isLastStep };
});

/**
 * Финальная отправка регистрации (вызывается после подтверждения в ModalSuggestion)
 */
export const submitRegistration = createAsyncThunk<
  { tokens: AuthTokens; userId: number; skillId: number },
  void,
  { state: { registration: RegistrationState }; rejectValue: string }
>('registration/submit', async (_, { getState, rejectWithValue }) => {
  try {
    const { formData } = getState().registration;

    const response = await authApi.register({
      // User data
      email: formData.credentials.email,
      password: formData.credentials.password,
      name: formData.user.name,
      avatarUrl: formData.user.avatarUrl,
      dateOfBirth: formData.user.dateOfBirth ?? '',
      gender: formData.user.gender,
      cityId: formData.user.cityId ?? 0,
      skillInterests: formData.user.skillInterests,
      // Skill data
      skill: {
        title: formData.skill.skillTitle,
        subcategoryId: formData.skill.skillSubcategoryId ?? 0,
        description: formData.skill.skillDescription,
        images: formData.skill.skillImages,
      },
    });

    // Сохраняем токены и userId
    localStorage.setItem('auth_tokens', JSON.stringify(response.tokens));
    localStorage.setItem('currentUserId', String(response.user.id));

    return {
      tokens: response.tokens,
      userId: response.user.id,
      skillId: response.skillId,
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Ошибка регистрации');
  }
});

// ============ SLICE ============

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Навигация
    prevStep(state) {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as RegistrationStep;
      }
    },
    goToStep(state, action: PayloadAction<RegistrationStep>) {
      state.currentStep = action.payload;
    },

    // Обновление данных шагов
    updateCredentials(state, action: PayloadAction<Partial<StepCredentials>>) {
      state.formData.credentials = { ...state.formData.credentials, ...action.payload };
      // Сбрасываем ошибку email при изменении
      if (action.payload.email !== undefined && state.stepErrors[1]?.email) {
        state.stepErrors[1] = { ...state.stepErrors[1], email: undefined };
      }
    },
    updateUserData(state, action: PayloadAction<Partial<StepUserData>>) {
      state.formData.user = { ...state.formData.user, ...action.payload };
    },
    updateSkillData(state, action: PayloadAction<Partial<StepSkillData>>) {
      state.formData.skill = { ...state.formData.skill, ...action.payload };
    },

    // Управление ошибками
    clearStepErrors(state, action: PayloadAction<RegistrationStep>) {
      state.stepErrors[action.payload] = null;
    },
    clearError(state) {
      state.error = null;
    },

    // Сброс состояния
    resetRegistration() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check email
      .addCase(checkEmailAvailability.pending, (state) => {
        state.isCheckingEmail = true;
      })
      .addCase(checkEmailAvailability.fulfilled, (state) => {
        state.isCheckingEmail = false;
      })
      .addCase(checkEmailAvailability.rejected, (state) => {
        state.isCheckingEmail = false;
      })
      // Submit step
      .addCase(submitStep.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitStep.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.stepErrors[state.currentStep] = null;
        if (!action.payload.isLastStep) {
          state.currentStep = action.payload.nextStep;
        }
      })
      .addCase(submitStep.rejected, (state, action) => {
        state.isSubmitting = false;
        const step = state.currentStep;
        state.stepErrors[step] = action.payload as RegistrationStepErrors[typeof step];
      })
      // Submit registration
      .addCase(submitRegistration.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitRegistration.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isCompleted = true;
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      });
  },
  selectors: {
    selectCurrentStep: (state) => state.currentStep,
    selectFormData: (state) => state.formData,
    selectCredentials: (state) => state.formData.credentials,
    selectUserData: (state) => state.formData.user,
    selectSkillData: (state) => state.formData.skill,
    selectIsSubmitting: (state) => state.isSubmitting,
    selectIsCheckingEmail: (state) => state.isCheckingEmail,
    selectStepErrors: (state) => state.stepErrors,
    selectStepCredentialErrors: (state) => state.stepErrors[1],
    selectStepUserDataErrors: (state) => state.stepErrors[2],
    selectStepSkillDataErrors: (state) => state.stepErrors[3],
    selectError: (state) => state.error,
    selectIsCompleted: (state) => state.isCompleted,
  },
});

export const {
  prevStep,
  goToStep,
  updateCredentials,
  updateUserData,
  updateSkillData,
  clearStepErrors,
  clearError,
  resetRegistration,
} = registrationSlice.actions;

export const {
  selectCurrentStep,
  selectFormData,
  selectCredentials,
  selectUserData,
  selectSkillData,
  selectIsSubmitting,
  selectIsCheckingEmail,
  selectStepErrors,
  selectStepCredentialErrors,
  selectStepUserDataErrors,
  selectStepSkillDataErrors,
  selectError,
  selectIsCompleted,
} = registrationSlice.selectors;

export default registrationSlice.reducer;
