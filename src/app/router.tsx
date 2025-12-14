import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Catalog,
  AuthorizePage,
  ProfilePage,
  ProfileFavoritesPage,
  ProfileRequestsPage,
  ProfileSkillsPage,
  ProfileExchangesPage,
  SkillPage,
  AboutPage,
  NotFoundPage,
  ServerErrorPage,
  PrivacyPage,
  TermsPage,
} from '@pages/index';
import Modal from '@features/modal/Modal';
import ModalExchange from '@widgets/modals/modal-exchange/ModalExchange';
import ModalOfferSuccess from '@widgets/modals/modal-offer-success/ModalOfferSuccess';

import ProtectedRoute from './routes/ProtectedRoute';
import ProfileEditForm from '@pages/profile/profileEditForm/ProfileEditForm';


function AppRouter() {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const handleModalClose = () => {
    window.history.back();
  };

  return (
    <Routes location={backgroundLocation || location}>
      {/* Главные страницы */}
      <Route path="/" element={<Catalog />} />
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

      {/* модалки */}
      <Route
        path="/profile/exchanges-modal"
        element={
          <Modal onClose={handleModalClose}>
            <ModalExchange onClose={handleModalClose} />
          </Modal>
        }
      />
      <Route
        path="/profile/offer-modal"
        element={
          <Modal onClose={handleModalClose}>
            {/* если не авторизован показывать ModalOfferSuccessUnauth */}
            <ModalOfferSuccess onClose={handleModalClose} />
          </Modal>
        }
      />

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
