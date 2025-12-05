import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Catalog,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ProfileFavoritesPage,
  SkillPage,
  AboutPage,
  NotFoundPage,
  ServerErrorPage,
  PrivacyPage,
  TermsPage,
} from '@pages/index';

function AppRouter() {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  return (
    <Routes location={backgroundLocation || location}>
      {/* Главные страницы */}
      <Route path="/" element={<Catalog />} />
      <Route path="/skill/:id" element={<SkillPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* 
        Страницы авторизации - защищены от авторизованных юзеров 
        TODO: <PrivateRoute forUnauthorized><LoginPage /></PrivateRoute>
        - перебрасывают на прошлую страницу, или на `/` 
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 
        Профиль пользователя - защищен от неавторизованных юзеров 
        TODO: <PrivateRoute><ProfilePage /></PrivateRoute>
      */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/favorites" element={<ProfileFavoritesPage />} />

      {/* Служебные страницы */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Страницы ошибок */}
      <Route path="/error" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
