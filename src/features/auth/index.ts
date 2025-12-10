// API
export { default as authApi } from './api/authApi';

// Model
export {
  authReducer,
  registrationReducer,
  login,
  logout,
  submitStep,
  submitRegistration,
  checkEmailAvailability,
  prevStep,
  goToStep,
  updateCredentials,
  updateUserData,
  updateSkillData,
  clearStepErrors,
  clearError,
  resetRegistration,
  selectTokens,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
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
} from './model';

// Types
export type {
  AuthTokens,
  LoginCredentials,
  RegistrationStep,
  StepCredentials,
  StepUserData,
  StepSkillData,
  StepCredentialsErrors,
  StepUserDataErrors,
  StepSkillDataErrors,
  StepValidationErrors,
  RegistrationStepErrors,
} from './model';
