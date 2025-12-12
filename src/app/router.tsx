import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Catalog,
  LoginPage,
  RegisterPage,
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

      {/*
        Страницы авторизации - защищены от авторизованных юзеров
        TODO: <PrivateRoute forUnauthorized><LoginPage /></PrivateRoute>
        - перебрасывают на прошлую страницу, или на `/`
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage step={1}/>} />
      <Route path="/register/step2" element={<RegisterPage step={2}/>} />
      <Route path="/register/step3" element={<RegisterPage step={3}/>} />

      {/*
        Профиль пользователя - защищен от неавторизованных юзеров
        TODO: <PrivateRoute><ProfilePage /></PrivateRoute>
      */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/favorites" element={<ProfileFavoritesPage />} />
      <Route path="/profile/requests" element={<ProfileRequestsPage />} />
      <Route path="/profile/skills" element={<ProfileSkillsPage />} />
      <Route path="/profile/exchanges" element={<ProfileExchangesPage />} />

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
