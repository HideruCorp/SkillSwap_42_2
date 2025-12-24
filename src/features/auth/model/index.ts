// Auth listener middleware
export { default as authListener } from './authListener'

// Auth slice
export {
  default as authReducer,
  bootstrapAuth,
  clearAuthError,
  login,
  logout,
  selectAuthChecked,
  selectCurrentUserId,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
  selectTokens,
  setAuthChecked,
  setCurrentUserId,
  setTokens,
} from './authSlice'

// Registration slice
export {
  checkEmailAvailability,
  clearError,
  clearStepErrors,
  goToStep,
  prevStep,
  default as registrationReducer,
  resetRegistration,
  selectCredentials,
  selectCurrentStep,
  selectError,
  selectFormData,
  selectIsCheckingEmail,
  selectIsCompleted,
  selectIsSubmitting,
  selectSkillData,
  selectStepCredentialErrors,
  selectStepErrors,
  selectStepSkillDataErrors,
  selectStepUserDataErrors,
  selectUserData,
  submitRegistration,
  submitStep,
  updateCredentials,
  updateSkillData,
  updateUserData,
} from './registrationSlice'

// Memoized selectors
export { selectCurrentUser, selectIsAuthenticated } from './selectors'

// Types
export type {
  AuthState,
  AuthTokens,
  LoginCredentials,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RegistrationFormData,
  RegistrationStep,
  RegistrationStepErrors,
  StepCredentials,
  StepCredentialsErrors,
  StepSkillData,
  StepSkillDataErrors,
  StepUserData,
  StepUserDataErrors,
  StepValidationErrors,
} from './types'
