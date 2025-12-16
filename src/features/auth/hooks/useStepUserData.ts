import { useCallback } from 'react';
import { useDispatch, useSelector } from '@app/store';
import type { StepUserData } from '../model';
import {
  updateUserData,
  prevStep,
  clearStepErrors,
  submitStep,
  selectUserData,
  selectStepUserDataErrors,
  selectIsSubmitting,
} from '../model';

/**
 * Хук для второго шага регистрации (user data)
 */
const useStepUserData = () => {
  const dispatch = useDispatch();

  // ============ SELECTORS ============
  const userData = useSelector(selectUserData);
  const errors = useSelector(selectStepUserDataErrors);
  const isSubmitting = useSelector(selectIsSubmitting);

  // ============ METHODS ============
  const handleUpdateUserData = useCallback(
    (data: Partial<StepUserData>) => {
      dispatch(updateUserData(data));
    },
    [dispatch]
  );

  const handleSubmitStep = useCallback(async () => {
    const result = await dispatch(submitStep(2));
    return submitStep.fulfilled.match(result);
  }, [dispatch]);

  const handlePrevStep = useCallback(() => {
    dispatch(prevStep());
  }, [dispatch]);

  const handleClearErrors = useCallback(() => {
    dispatch(clearStepErrors(2));
  }, [dispatch]);

  return {
    // State
    userData,
    errors,
    isSubmitting,

    // Methods
    updateUserData: handleUpdateUserData,
    submitStep: handleSubmitStep,
    prevStep: handlePrevStep,
    clearErrors: handleClearErrors,
  };
};

export default useStepUserData;
