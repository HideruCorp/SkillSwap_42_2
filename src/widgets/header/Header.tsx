import { useState } from 'react';
import Logo from '@shared/ui/logo/Logo';
import { SearchInput } from '@shared/ui/search';
import Button from '@shared/ui/button/Button';
import Dropdown from '@shared/ui/dropdown';
import ProfileMenu from '@widgets/header/profile/profile-menu';
import styles from './header.module.scss';
import ThemeToggler from './theme-toggler/ThemeToggler';
import AllSkillsDropdown from './all-skills-dropdown/AllSkillsDropdown';
import Notification from './notification/Notification';
import Favorites from './favorites/Favorites';
import UserInfo from './userInfo/UserInfo';

function Header() {
  const [authenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleToggleProfileMenu = (isOpen: boolean) => {
    setIsProfileMenuOpen(isOpen);
  };

  const handleLogout = () => {
    // TODO: Добавить логику выхода из аккаунта
    setIsProfileMenuOpen(false);
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
              <Notification />
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
            <Button type="default" className={styles['sign-in']} title="Войти" onClick={() => {}} />
            <Button
              type="primary"
              className={styles['sign-up']}
              title="Зарегистрироваться"
              onClick={() => {}}
            />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
