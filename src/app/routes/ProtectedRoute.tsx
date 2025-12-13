import Preloader from '@shared/ui/preloader/Preloader';
import { selectIsAuthenticated, selectAuthChecked, selectIsLoggingIn } from '@features/auth';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  forUnauthorized?: boolean;
  children?: React.ReactElement;
};

function ProtectedRoute({ forUnauthorized, children }: ProtectedRouteProps) {
  const authChecked = useSelector(selectAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoggingIn = useSelector(selectIsLoggingIn);

  const location = useLocation();

  // Показываем прелоадер пока не завершён bootstrap или идёт логин
  if (!authChecked || isLoggingIn) {
    return <Preloader />;
  }

  // Роут для неавторизованных, но пользователь авторизован — редирект
  if (forUnauthorized && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Роут для авторизованных, но пользователь не авторизован — редирект на /auth
  if (!forUnauthorized && !isAuthenticated) {
    return <Navigate replace to="/auth" state={{ from: location }} />;
  }

  // Роут для неавторизованных и пользователь не авторизован — показываем children
  if (forUnauthorized && !isAuthenticated) {
    return children;
  }

  // Роут для авторизованных и пользователь авторизован — показываем Outlet
  return <Outlet />;
}

export default ProtectedRoute;
