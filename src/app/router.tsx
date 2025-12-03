import Catalog from '@pages/catalog';
import { Routes, Route, useLocation } from 'react-router-dom';

function AppRouter() {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  return (
    <Routes location={backgroundLocation || location}>
      <Route path="/" element={<Catalog />} />
      {/*
      <Route
        path="/login"
        element={
          <PrivateRoute forUnauthorized>
            <Login />
          </PrivateRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PrivateRoute forUnauthorized>
            <Register />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/orders"
        element={
          <PrivateRoute>
            <ProfileOrders />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound404 />} />
      */}
    </Routes>
  );
}

export default AppRouter;
