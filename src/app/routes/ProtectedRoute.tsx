import Preloader from "@shared/ui/preloader/Preloader";
import { selectIsLoggedIn, selectIsLoggingIn } from "@features/auth";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  forUnauthorized?: boolean;
  children?: React.ReactElement;
};

export const ProtectedRoute = ({
  forUnauthorized,
  children
}: ProtectedRouteProps) => {
  const isLoggingIn = useSelector(selectIsLoggingIn);
  const hasToken = useSelector(selectIsLoggedIn);

  const location = useLocation();

  if (isLoggingIn) {
    return <Preloader />;
  }

  if (!forUnauthorized && !hasToken) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (forUnauthorized && hasToken) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (forUnauthorized && !hasToken) {
    return children;
  }

  return <Outlet />;
};