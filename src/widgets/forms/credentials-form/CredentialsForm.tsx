import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { InputUI } from '@shared/ui/Input/index';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import { CredentialsValidationSchema, getPasswordStrength } from '@shared/lib/validationSchema';
import styles from './credentials-form.module.scss';

export interface CredentialsFormData {
  email: string;
  password: string;
}

export interface CredentialsFormErrors {
  email?: string;
  password?: string;
  root?: string;
}

interface CredentialsFormProps {
  /** Начальные значения формы */
  defaultValues: CredentialsFormData;
  /** Обработчик отправки формы */
  onSubmit: (data: CredentialsFormData) => Promise<void>;
  /** Callback при изменении email */
  onChange: (data: Partial<CredentialsFormData>) => void;
  /** Флаг загрузки (блокирует форму) */
  isLoading?: boolean;
  /** Флаг проверки email */
  isCheckingEmail?: boolean;
  /** Является ли пользователь новым (null = не определено) */
  isNewUser: boolean | null;
  /** Внешние ошибки (например, от сервера) */
  errors?: CredentialsFormErrors;
}

const doNothing = () => {};

function CredentialsForm({
  defaultValues,
  onSubmit,
  onChange,
  isLoading = false,
  isCheckingEmail = false,
  isNewUser,
  errors: externalErrors,
}: CredentialsFormProps) {
  const isFirstRender = useRef(true);

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setError,
    clearErrors,
    watch,
    reset,
  } = useForm<CredentialsFormData>({
    resolver: yupResolver(CredentialsValidationSchema),
    defaultValues,
    mode: 'onBlur',
  });

  // Синхронизация формы с внешними defaultValues при перемонтировании
  // (когда пользователь вернулся на шаг 1)
  useEffect(() => {
    // Пропускаем первый рендер — defaultValues уже применены
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // При последующих рендерах синхронизируем с пропсами
    // Это нужно если компонент перемонтировался
    reset(defaultValues, { keepErrors: false });
  }, [defaultValues, reset]);

  const passwordValue = watch('password');
  const passwordStrength = getPasswordStrength(passwordValue || '');

  // Синхронизация внешних ошибок с react-hook-form
  useEffect(() => {
    if (externalErrors?.email) {
      setError('email', { message: externalErrors.email });
    } else {
      clearErrors('email');
    }

    if (externalErrors?.password) {
      setError('password', { message: externalErrors.password });
    } else {
      clearErrors('password');
    }
  }, [externalErrors, setError, clearErrors]);

  const getPasswordMessage = () => {
    if (formErrors.password || externalErrors?.password) return undefined;
    // Показываем оценку пароля только для новых пользователей
    if (isNewUser && passwordValue && passwordStrength.label) {
      return passwordStrength.label;
    }
    return undefined;
  };

  const getEmailMessage = () => {
    if (isCheckingEmail) return 'Проверка email...';
    return undefined;
  };

  const handleFormSubmit = async (data: CredentialsFormData) => {
    await onSubmit(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={styles.socialButtons}>
        <SocialButton provider="google" onClick={doNothing} />
        <SocialButton provider="apple" onClick={doNothing} />
      </div>

      <Divider />

      <div className={styles.inputs}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputUI
              label="Email"
              type="email"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onChange({ email: value });
              }}
              placeholder="Введите email"
              error={formErrors.email?.message || externalErrors?.email}
              message={getEmailMessage()}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputUI
              label="Пароль"
              name="password"
              type="password"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onChange({ password: value });
              }}
              placeholder="Введите пароль"
              error={formErrors.password?.message || externalErrors?.password}
              message={getPasswordMessage()}
            />
          )}
        />
      </div>

      {(externalErrors?.root || formErrors.root) && (
        <div className={styles.formError}>{externalErrors?.root || formErrors.root?.message}</div>
      )}

      <div className={styles.submitButton}>
        <Button
          htmlType="submit"
          type="primary"
          title={isLoading ? 'Обработка...' : 'Далее'}
          disabled={isLoading || isCheckingEmail}
        />
      </div>
    </form>
  );
}

export default CredentialsForm;
