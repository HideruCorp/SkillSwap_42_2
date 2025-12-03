import { useState } from 'react';
import Logo from '@shared/ui/logo/Logo';
import { SearchInput } from '@shared/ui/search';
import Button from '@shared/ui/button/Button';
import styles from './header.module.scss';
import ThemeToggler from './theme-toggler/ThemeToggler';
import AllSkillsDropdown from './all-skills-dropdown/AllSkillsDropdown';
import Notification from './notification/Notification';
import Favorites from './favorites/Favorites';
import UserInfo from './userInfo/UserInfo';

function Header() {
  const [authenticated] = useState(false);

  return (
    <header className={`${styles.header}`}>
      <Logo />
      <a href="#about" className={`${styles.about}`}>
        О проекте
      </a>
      <AllSkillsDropdown />
      <SearchInput />
      <ThemeToggler />
      {authenticated ? (
        <>
          <Notification />
          <Favorites />
          <UserInfo userName="Мария" />
        </>
      ) : (
        <>
          <Button type="default" className={`${styles.signIn}`} title="Войти" onClick={() => {}} />
          <Button
            type="primary"
            className={`${styles.signUp}`}
            title="Зарегистрироваться"
            onClick={() => {}}
          />
        </>
      )}
    </header>
  );
}

export default Header;
