import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Catalog,
  LoginPage,
  RegisterPage,
  RegisterStep2Page,
  RegisterStep3Page,
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
import { ProtectedRoute } from './routes/ProtectedRoute';

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
        path="/login"
        element={
          <ProtectedRoute forUnauthorized>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute forUnauthorized>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register/step2"
        element={
          <ProtectedRoute forUnauthorized>
            <RegisterStep2Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register/step3"
        element={
          <ProtectedRoute forUnauthorized>
            <RegisterStep3Page />
          </ProtectedRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/favorites" element={<ProfileFavoritesPage />} />
        <Route path="/profile/requests" element={<ProfileRequestsPage />} />
        <Route path="/profile/skills" element={<ProfileSkillsPage />} />
        <Route path="/profile/exchanges" element={<ProfileExchangesPage />} />
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
