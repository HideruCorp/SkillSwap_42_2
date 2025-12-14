import { useCallback } from 'react';
import { useDispatch, useSelector } from '../../../services/store';
import type { StepCredentials } from '../model';
import {
  updateCredentials,
  clearStepErrors,
  checkEmailAvailability,
  submitStep,
  selectCredentials,
  selectStepCredentialErrors,
  selectIsCheckingEmail,
  selectIsSubmitting,
} from '../model';

/**
 * Хук для первого шага регистрации (credentials)
 */
const useStepCredentials = () => {
  const dispatch = useDispatch();

  // ============ SELECTORS ============
  const credentials = useSelector(selectCredentials);
  const errors = useSelector(selectStepCredentialErrors);
  const isCheckingEmail = useSelector(selectIsCheckingEmail);
  const isSubmitting = useSelector(selectIsSubmitting);

  // ============ METHODS ============
  const handleUpdateCredentials = useCallback(
    (data: Partial<StepCredentials>) => {
      dispatch(updateCredentials(data));
    },
    [dispatch]
  );

  const handleSubmitStep = useCallback(async () => {
    const result = await dispatch(submitStep(1));
    return submitStep.fulfilled.match(result);
  }, [dispatch]);

  /**
   * Проверка доступности email (для интеграции с yup)
   */
  const handleCheckEmail = useCallback(
    async (email: string) => {
      const result = await dispatch(checkEmailAvailability(email));
      return checkEmailAvailability.fulfilled.match(result) ? result.payload : false;
    },
    [dispatch]
  );

  const handleClearErrors = useCallback(() => {
    dispatch(clearStepErrors(1));
  }, [dispatch]);

  return {
    // State
    credentials,
    errors,
    isCheckingEmail,
    isSubmitting,

    // Methods
    updateCredentials: handleUpdateCredentials,
    submitStep: handleSubmitStep,
    checkEmail: handleCheckEmail,
    clearErrors: handleClearErrors,
  };
};

export default useStepCredentials;
