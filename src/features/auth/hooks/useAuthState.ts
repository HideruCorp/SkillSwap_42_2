import { useSelector } from '../../../services/store';
import {
  selectTokens,
  selectCurrentUserId,
  selectAuthChecked,
  selectIsLoggingIn,
  selectLoginError,
  selectIsAuthenticated,
  selectCurrentUser,
} from '../model';

/**
 * Хук для просмотра состояния авторизации
 * Предоставляет доступ ко всем данным auth в удобном формате
 */
function useAuthState() {
  const tokens = useSelector(selectTokens);
  const currentUserId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isChecked = useSelector(selectAuthChecked);
  const isLoggingIn = useSelector(selectIsLoggingIn);
  const loginError = useSelector(selectLoginError);

  const hasValidToken = Boolean(tokens && tokens.expiresAt > Date.now());

  return {
    // Данные авторизации
    tokens,
    currentUserId,
    currentUser,

    // Состояние
    hasValidToken,
    isAuthenticated,
    isChecked,
    isLoggingIn,

    // Ошибки
    loginError,
  };
}

export default useAuthState;
