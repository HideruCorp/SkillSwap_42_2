// API
export { default as authApi } from './api/authApi'

// Hooks
export {
  useAuthState,
  useLogin,
  useRegistrationWizard,
  useStepCredentials,
  useStepSkillData,
  useStepUserData,
} from './hooks'

// Model
export {
  authListener,
  authReducer,
  bootstrapAuth,
  checkEmailAvailability,
  clearAuthError,
  clearError,
  clearStepErrors,
  goToStep,
  login,
  logout,
  prevStep,
  registrationReducer,
  resetRegistration,
  selectAuthChecked,
  selectCredentials,
  selectCurrentStep,
  selectCurrentUser,
  selectCurrentUserId,
  selectError,
  selectFormData,
  selectIsAuthenticated,
  selectIsCheckingEmail,
  selectIsCompleted,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectIsSubmitting,
  selectLoginError,
  selectSkillData,
  selectStepCredentialErrors,
  selectStepErrors,
  selectStepSkillDataErrors,
  selectStepUserDataErrors,
  // Selectors
  selectTokens,
  selectUserData,
  setAuthChecked,
  setCurrentUserId,
  setTokens,
  submitRegistration,
  submitStep,
  updateCredentials,
  updateSkillData,
  updateUserData,
} from './model'

// Types
export type {
  AuthTokens,
  LoginCredentials,
  RegistrationStep,
  RegistrationStepErrors,
  StepCredentials,
  StepCredentialsErrors,
  StepSkillData,
  StepSkillDataErrors,
  StepUserData,
  StepUserDataErrors,
  StepValidationErrors,
} from './model'
