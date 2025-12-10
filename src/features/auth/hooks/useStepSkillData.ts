import { useCallback } from 'react';
import { useDispatch, useSelector } from '../../../services/store';
import type { StepSkillData } from '../model';
import {
  updateSkillData,
  prevStep,
  clearStepErrors,
  submitStep,
  selectSkillData,
  selectStepSkillDataErrors,
  selectIsSubmitting,
} from '../model';

/**
 * Хук для третьего шага регистрации (skill data)
 */
const useStepSkillData = () => {
  const dispatch = useDispatch();

  // ============ SELECTORS ============
  const skillData = useSelector(selectSkillData);
  const errors = useSelector(selectStepSkillDataErrors);
  const isSubmitting = useSelector(selectIsSubmitting);

  // ============ METHODS ============
  const handleUpdateSkillData = useCallback(
    (data: Partial<StepSkillData>) => {
      dispatch(updateSkillData(data));
    },
    [dispatch]
  );

  const handleSubmitStep = useCallback(async () => {
    const result = await dispatch(submitStep(3));
    return submitStep.fulfilled.match(result);
  }, [dispatch]);

  const handlePrevStep = useCallback(() => {
    dispatch(prevStep());
  }, [dispatch]);

  const handleClearErrors = useCallback(() => {
    dispatch(clearStepErrors(3));
  }, [dispatch]);

  return {
    // State
    skillData,
    errors,
    isSubmitting,

    // Methods
    updateSkillData: handleUpdateSkillData,
    submitStep: handleSubmitStep,
    prevStep: handlePrevStep,
    clearErrors: handleClearErrors,
  };
};

export default useStepSkillData;
