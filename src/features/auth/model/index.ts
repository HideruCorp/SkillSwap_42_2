// Auth slice
export {
  default as authReducer,
  login,
  logout,
  bootstrapAuth,
  setTokens,
  setCurrentUserId,
  setAuthChecked,
  clearAuthError,
  selectTokens,
  selectCurrentUserId,
  selectAuthChecked,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
} from './authSlice';

// Memoized selectors
export { selectIsAuthenticated, selectCurrentUser } from './selectors';

// Auth listener middleware
export { default as authListener } from './authListener';

// Registration slice
export {
  default as registrationReducer,
  checkEmailAvailability,
  submitStep,
  submitRegistration,
  prevStep,
  goToStep,
  updateCredentials,
  updateUserData,
  updateSkillData,
  clearStepErrors,
  clearError,
  resetRegistration,
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
} from './registrationSlice';

// Types
export type {
  AuthTokens,
  AuthState,
  LoginCredentials,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
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
} from './types';
