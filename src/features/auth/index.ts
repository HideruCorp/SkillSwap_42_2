// API
export { default as authApi } from './api/authApi';

// Hooks
export {
  useRegistrationWizard,
  useStepCredentials,
  useStepUserData,
  useStepSkillData,
  useLogin,
  useAuthState,
} from './hooks';

// Model
export {
  authReducer,
  registrationReducer,
  authListener,
  login,
  logout,
  bootstrapAuth,
  setTokens,
  setCurrentUserId,
  setAuthChecked,
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
  clearAuthError,
  // Selectors
  selectTokens,
  selectCurrentUserId,
  selectAuthChecked,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
  selectIsAuthenticated,
  selectCurrentUser,
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
