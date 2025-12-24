import type { CredentialsFormData, CredentialsFormErrors } from '@widgets/forms/credentials-form'
import { useLogin, useStepCredentials } from '@features/auth'
import CredentialsForm from '@widgets/forms/credentials-form'
import { useCallback, useMemo } from 'react'

interface CredentialsStepContainerProps {
  onLoginSuccess: () => void
}

function CredentialsStep({ onLoginSuccess }: CredentialsStepContainerProps) {
  const {
    credentials,
    updateCredentials,
    submitStep,
    isCheckingEmail,
    isSubmitting,
    isEmailAvailable,
    stepErrors,
  } = useStepCredentials()

  const { loginUser, isLoading, loginError, clearLoginError } = useLogin()

  const externalErrors: CredentialsFormErrors | undefined = useMemo(() => {
    const errors: CredentialsFormErrors = {}

    if (stepErrors?.email)
      errors.email = stepErrors.email
    if (stepErrors?.password)
      errors.password = stepErrors.password

    if (loginError)
      errors.root = loginError

    return Object.keys(errors).length > 0 ? errors : undefined
  }, [stepErrors, loginError])

  const handleChange = useCallback(
    (data: Partial<CredentialsFormData>) => {
      // Если пользователь меняет данные — логичнее убрать прошлую ошибку логина
      clearLoginError()
      updateCredentials(data)
    },
    [clearLoginError, updateCredentials],
  )

  const handleSubmit = useCallback(
    async (data: CredentialsFormData) => {
      // Если проверка email ещё не завершена — ничего не делаем
      if (isEmailAvailable === null)
        return

      if (isEmailAvailable === false) {
        // Email существует — пытаемся войти
        clearLoginError()
        const success = await loginUser(data.email, data.password)
        if (success) {
          onLoginSuccess()
        }
        return
      }

      // Email свободен — начинаем регистрацию (submitStep(1) внутри хука)
      await submitStep()
    },
    [isEmailAvailable, clearLoginError, loginUser, onLoginSuccess, submitStep],
  )

  return (
    <CredentialsForm
      defaultValues={credentials}
      onSubmit={handleSubmit}
      onChange={handleChange}
      isLoading={isLoading || isSubmitting}
      isCheckingEmail={isCheckingEmail}
      isNewUser={isEmailAvailable}
      errors={externalErrors}
    />
  )
}

export default CredentialsStep
export { CredentialsStep }
