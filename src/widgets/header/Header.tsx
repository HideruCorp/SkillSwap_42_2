import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@shared/ui/logo/Logo';
import { SearchInput } from '@shared/ui/search';
import Button from '@shared/ui/button/Button';
import Dropdown from '@shared/ui/dropdown';
import ProfileMenu from '@widgets/header/profile/profile-menu';
import { NotificationIcon, NotificationPanel, useNotifications } from '@features/notifications';
import styles from './header.module.scss';
import ThemeToggler from './theme-toggler/ThemeToggler';
import AllSkillsDropdown from './all-skills-dropdown/AllSkillsDropdown';
import Favorites from './favorites/Favorites';
import UserInfo from './userInfo/UserInfo';

// TODO: Заменить на ID авторизованного пользователя
const CURRENT_USER_ID = 1;

function Header() {

  const navigate = useNavigate();
  const [authenticated] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const { hasUnread } = useNotifications(CURRENT_USER_ID);

  const handleToggleProfileMenu = (isOpen: boolean) => {
    setIsProfileMenuOpen(isOpen);
  };

  const handleToggleNotificationPanel = (isOpen: boolean) => {
    setIsNotificationPanelOpen(isOpen);
  };

  const handleCloseNotificationPanel = () => {
    setIsNotificationPanelOpen(false);
  };

  const handleLogout = () => {
    // TODO: Добавить логику выхода из аккаунта
    setIsProfileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <header className={`${styles.header}`}>
      <Logo />
      <nav className={styles.navigation}>
        <a href="#about" className={`${styles.about}`}>
          О проекте
        </a>
        <AllSkillsDropdown />
      </nav>
      <SearchInput />
      {!authenticated && <ThemeToggler />}
      <div
        className={`${styles['profile-panel']} ${authenticated && styles['profile-panel--authenticated']}`}
      >
        {authenticated ? (
          <>
            <div className={styles['profile-icons']}>
              <ThemeToggler />
              <Dropdown
                trigger={<NotificationIcon hasUnread={hasUnread} />}
                align="right"
                isOpen={isNotificationPanelOpen}
                onToggle={handleToggleNotificationPanel}
              >
                <NotificationPanel
                  userId={CURRENT_USER_ID}
                  onClose={handleCloseNotificationPanel}
                />
              </Dropdown>
              <Favorites />
            </div>
            <Dropdown
              trigger={<UserInfo userName="Мария" />}
              align="right"
              isOpen={isProfileMenuOpen}
              onToggle={handleToggleProfileMenu}
            >
              <ProfileMenu
                onLinkClick={() => setIsProfileMenuOpen(false)}
                handleLogout={handleLogout}
              />
            </Dropdown>
          </>
        ) : (
          <>
            <Button type="default" className={styles['sign-in']} title="Войти" onClick={handleLoginClick} />
            <Button
              type="primary"
              className={styles['sign-up']}
              title="Зарегистрироваться"
              onClick={handleRegisterClick}
            />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
