import {
  AboutPage,
  AuthorizePage,
  MainPage,
  NotFoundPage,
  PrivacyPage,
  ProfileExchangesPage,
  ProfileFavoritesPage,
  ProfilePage,
  ProfileRequestsPage,
  ProfileSkillsPage,
  ServerErrorPage,
  SkillPage,
  TermsPage,
} from '@pages/index';
import { Route, Routes, useLocation } from 'react-router-dom';

import ProfileEditForm from '@pages/profile/profileEditForm/ProfileEditForm';
import ProtectedRoute from './routes/ProtectedRoute';

function AppRouter() {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  return (
    <Routes location={backgroundLocation || location}>
      {/* Главные страницы */}
      <Route path="/" element={<MainPage />} />
      <Route path="/skill/:id" element={<SkillPage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route
        path="/auth"
        element={
          <ProtectedRoute forUnauthorized>
            <AuthorizePage />
          </ProtectedRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/profile"
          element={
            <ProfilePage>
              <ProfileEditForm />
            </ProfilePage>
          }
        />
        <Route
          path="/profile/favorites"
          element={
            <ProfilePage>
              <ProfileFavoritesPage />
            </ProfilePage>
          }
        />
        <Route
          path="/profile/requests"
          element={
            <ProfilePage>
              <ProfileRequestsPage />
            </ProfilePage>
          }
        />
        <Route
          path="/profile/skills"
          element={
            <ProfilePage>
              <ProfileSkillsPage />
            </ProfilePage>
          }
        />
        <Route
          path="/profile/exchanges"
          element={
            <ProfilePage>
              <ProfileExchangesPage />
            </ProfilePage>
          }
        />
      </Route>

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
