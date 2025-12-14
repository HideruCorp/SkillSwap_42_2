import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { InputUI } from '@shared/ui/Input/index';
import Button from '@shared/ui/button/Button';
import { SocialButton } from '@shared/ui/social-button';
import { Divider } from '@shared/ui/divider';
import { CredentialsValidationSchema, getPasswordStrength } from '@shared/lib/validationSchema';
import { useStepCredentials } from '@features/auth';
import { useDebounce } from '@shared/hooks/useDebounce';
import styles from './credentials-form.module.scss';

export interface CredentialsFormData {
  email: string;
  password: string;
}

interface CredentialsFormProps {
  onSubmit: (data: CredentialsFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const doNothing = () => {};

const EMAIL_CHECK_DELAY = 500;

function CredentialsForm({ onSubmit, isLoading = false, error }: CredentialsFormProps) {
  const { credentials, updateCredentials, checkEmail, isCheckingEmail, isSubmitting } =
    useStepCredentials();
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
  } = useForm<CredentialsFormData>({
    resolver: yupResolver(CredentialsValidationSchema),
    defaultValues: {
      email: credentials.email || '',
      password: credentials.password || '',
    },
    mode: 'onBlur',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordStrength = getPasswordStrength(passwordValue || '');
  const debouncedEmail = useDebounce(emailValue, EMAIL_CHECK_DELAY);

  // Проверяем email при изменении debounced значения
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!debouncedEmail || errors.email) {
        setIsNewUser(null);
        return;
      }
      const isAvailable = await checkEmail(debouncedEmail);
      setIsNewUser(isAvailable);
    };

    checkEmailAvailability();
  }, [debouncedEmail, checkEmail, errors.email]);

  const getPasswordMessage = () => {
    if (errors.password) return undefined;
    // Показываем оценку пароля только для новых пользователей
    if (isNewUser && passwordValue && passwordStrength.label) {
      return passwordStrength.label;
    }
    return undefined;
  };

  // Показываем внешнюю ошибку (например, "Неверный пароль")
  useEffect(() => {
    if (error) {
      setError('email', { message: error });
    }
  }, [error, setError]);

  const handleFormSubmit = async (data: CredentialsFormData) => {
    // Сохраняем credentials в Redux store
    updateCredentials({ email: data.email, password: data.password });
    // Вызываем **внешний обработчик** onSubmit, нужно потому что сейчас на кнопку далее подвязаны два варианта действий - вход или регистрация
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
              onChange={field.onChange}
              placeholder="Введите email"
              error={errors.email?.message}
              message={isCheckingEmail ? 'Проверка email...' : undefined}
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
              onChange={field.onChange}
              placeholder="Введите пароль"
              error={errors.password?.message}
              message={getPasswordMessage()}
            />
          )}
        />
      </div>

      {errors.root && <div className={styles.formError}>{errors.root.message}</div>}

      <div className={styles.submitButton}>
        <Button
          htmlType="submit"
          type="primary"
          title={isLoading || isSubmitting ? 'Обработка...' : 'Далее'}
          disabled={isLoading || isSubmitting}
        />
      </div>
    </form>
  );
}

export default CredentialsForm;
