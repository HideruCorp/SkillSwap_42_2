import type { StepCredentials } from '../model'
import { useDispatch, useSelector } from '@app/store'
import { useDebouncedCallback } from '@shared/hooks/useDebounce'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  checkEmailAvailability,
  clearStepErrors,
  selectCredentials,
  selectIsCheckingEmail,
  selectIsSubmitting,
  selectStepCredentialErrors,
  submitStep,
  updateCredentials,
} from '../model'

const EMAIL_DEBOUNCE_DELAY = 500

/**
 * Хук для первого шага регистрации (credentials)
 */
function useStepCredentials() {
  const dispatch = useDispatch()

  // ============ SELECTORS ============
  const credentials = useSelector(selectCredentials)
  const stepErrors = useSelector(selectStepCredentialErrors)
  const isCheckingEmail = useSelector(selectIsCheckingEmail)
  const isSubmitting = useSelector(selectIsSubmitting)

  // ============ LOCAL STATE ============
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null)
  const prevEmailRef = useRef<string>('')
  const isInitializedRef = useRef(false)

  // ============ DEBOUNCED CHECK ============
  const checkEmail = useDebouncedCallback(async (email: string) => {
    const result = await dispatch(checkEmailAvailability(email))
    if (checkEmailAvailability.fulfilled.match(result)) {
      setIsEmailAvailable(result.payload)
    }
  }, EMAIL_DEBOUNCE_DELAY)

  // ============ EFFECTS ============

  // Инициализация: если email уже есть в store (возврат на шаг) — проверяем его
  useEffect(() => {
    if (isInitializedRef.current)
      return
    isInitializedRef.current = true

    const { email } = credentials
    if (email) {
      prevEmailRef.current = email
      // Запускаем проверку немедленно (без debounce) для уже введённого email
      dispatch(checkEmailAvailability(email)).then((result) => {
        if (checkEmailAvailability.fulfilled.match(result)) {
          setIsEmailAvailable(result.payload)
        }
      })
    }
  }, [credentials, dispatch])

  // Отслеживание изменений email
  useEffect(() => {
    const { email } = credentials

    // Не проверяем, если email не изменился
    if (email === prevEmailRef.current) {
      return
    }

    prevEmailRef.current = email
    setIsEmailAvailable(null)

    if (!email) {
      return
    }

    checkEmail(email)
  }, [credentials, checkEmail])

  // ============ METHODS ============
  const handleUpdateCredentials = useCallback(
    (data: Partial<StepCredentials>) => {
      dispatch(updateCredentials(data))
    },
    [dispatch],
  )

  const handleSubmitStep = useCallback(async () => {
    const result = await dispatch(submitStep(1))
    return submitStep.fulfilled.match(result)
  }, [dispatch])

  const handleClearErrors = useCallback(() => {
    dispatch(clearStepErrors(1))
  }, [dispatch])

  const resetEmailAvailability = useCallback(() => {
    setIsEmailAvailable(null)
    prevEmailRef.current = ''
    isInitializedRef.current = false
  }, [])

  return {
    credentials,
    stepErrors,
    isCheckingEmail,
    isSubmitting,
    isEmailAvailable,

    updateCredentials: handleUpdateCredentials,
    submitStep: handleSubmitStep,
    clearErrors: handleClearErrors,
    resetEmailAvailability,
  }
}

export default useStepCredentials
