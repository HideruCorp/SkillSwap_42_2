import { useCallback } from 'react';
import { useDispatch, useSelector } from '@app/store';
import type { RegistrationStep } from '../model';
import {
  goToStep,
  resetRegistration,
  clearError,
  submitRegistration,
  setTokens,
  setCurrentUserId,
  setAuthChecked,
  selectCurrentStep,
  selectFormData,
  selectIsSubmitting,
  selectError,
  selectIsCompleted,
} from '../model';

/**
 * Главный хук для RegisterPage
 * Управляет wizard'ом и финальной отправкой регистрации
 */
const useRegistrationWizard = () => {
  const dispatch = useDispatch();

  // ============ SELECTORS ============
  const currentStep = useSelector(selectCurrentStep);
  const formData = useSelector(selectFormData);
  const isSubmitting = useSelector(selectIsSubmitting);
  const error = useSelector(selectError);
  const isCompleted = useSelector(selectIsCompleted);

  // ============ METHODS ============
  const handleGoToStep = useCallback(
    (step: RegistrationStep) => {
      dispatch(goToStep(step));
    },
    [dispatch]
  );

  const handleSubmitRegistration = useCallback(async (): Promise<{
    success: boolean;
    skillId: number | null;
  }> => {
    const result = await dispatch(submitRegistration());

    if (submitRegistration.fulfilled.match(result)) {
      // Синхронизируем auth state после успешной регистрации
      const { tokens, userId, skillId } = result.payload;
      dispatch(setTokens(tokens));
      dispatch(setCurrentUserId(userId));
      dispatch(setAuthChecked(true));
      return { success: true, skillId };
    }

    return { success: false, skillId: null };
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetRegistration());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    currentStep,
    formData,
    isSubmitting,
    error,
    isCompleted,

    // Methods
    goToStep: handleGoToStep,
    submitRegistration: handleSubmitRegistration,
    reset: handleReset,
    clearError: handleClearError,
  };
};

export default useRegistrationWizard;
