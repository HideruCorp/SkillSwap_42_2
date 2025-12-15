import { useCallback } from 'react';
import { useDispatch, useSelector } from '../../../services/store';
import { login, clearAuthError, selectIsLoggingIn, selectLoginError } from '../model';

/**
 * Хук для авторизации пользователя
 * Использует состояние из Redux authSlice
 */
const useLogin = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoggingIn);
  const loginError = useSelector(selectLoginError);

  const loginUser = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const result = await dispatch(login({ email, password }));
      return login.fulfilled.match(result);
    },
    [dispatch]
  );

  const clearLoginError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    isLoading,
    loginError,
    loginUser,
    clearLoginError,
  };
};

export default useLogin;
