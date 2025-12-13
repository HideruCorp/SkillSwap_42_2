import { useState, useCallback } from 'react';
import { useDispatch } from '../../../services/store';
import { login } from '../model';

/**
 * Хук для авторизации пользователя
 */
const useLogin = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const loginUser = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoginError('');
      setIsLoading(true);

      try {
        const result = await dispatch(login({ email, password }));

        if (login.fulfilled.match(result)) {
          return true;
        }

        setLoginError(result.payload ?? 'Неверный логин или пароль');
        return false;
      } catch {
        setLoginError('Ошибка при входе. Попробуйте снова');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  const clearLoginError = useCallback(() => setLoginError(''), []);

  return {
    isLoading,
    loginError,
    loginUser,
    clearLoginError,
  };
};

export default useLogin;
