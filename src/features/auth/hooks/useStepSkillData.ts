import type { StepSkillData } from '../model'
import { useDispatch, useSelector } from '@app/store'
import { useCallback } from 'react'
import {
  clearStepErrors,
  prevStep,
  selectIsSubmitting,
  selectSkillData,
  selectStepSkillDataErrors,
  submitStep,
  updateSkillData,
} from '../model'

/**
 * Хук для третьего шага регистрации (skill data)
 */
function useStepSkillData() {
  const dispatch = useDispatch()

  // ============ SELECTORS ============
  const skillData = useSelector(selectSkillData)
  const errors = useSelector(selectStepSkillDataErrors)
  const isSubmitting = useSelector(selectIsSubmitting)

  // ============ METHODS ============
  const handleUpdateSkillData = useCallback(
    (data: Partial<StepSkillData>) => {
      dispatch(updateSkillData(data))
    },
    [dispatch],
  )

  const handleSubmitStep = useCallback(async () => {
    const result = await dispatch(submitStep(3))
    return submitStep.fulfilled.match(result)
  }, [dispatch])

  const handlePrevStep = useCallback(() => {
    dispatch(prevStep())
  }, [dispatch])

  const handleClearErrors = useCallback(() => {
    dispatch(clearStepErrors(3))
  }, [dispatch])

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
  }
}

export default useStepSkillData
