import { useCallback } from 'react';
import { useDispatch, useSelector } from '../../../services/store';
import type { RegistrationStep } from '../model';
import {
  goToStep,
  resetRegistration,
  clearError,
  submitRegistration,
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

  const handleSubmitRegistration = useCallback(async () => {
    const result = await dispatch(submitRegistration());
    return submitRegistration.fulfilled.match(result);
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
