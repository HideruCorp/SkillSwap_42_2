import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '@shared/ui/logo/Logo';
import { SearchInput } from '@shared/ui/search';
import Button from '@shared/ui/button/Button';
import Dropdown from '@shared/ui/dropdown';
import ProfileMenu from '@widgets/header/profile/profile-menu';
import { NotificationIcon, NotificationPanel, useNotifications } from '@features/notifications';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useDispatch, useSelector } from '@app/store';
import { selectTextSearch, setTextSearch } from '@features/filters';
import { logout, useAuthState } from '@features/auth';
import styles from './header.module.scss';
import ThemeToggler from './theme-toggler/ThemeToggler';
import AllSkillsDropdown from './all-skills-dropdown/AllSkillsDropdown';
import Favorites from './favorites/Favorites';
import UserInfo from './userInfo/UserInfo';

const SEARCH_DEBOUNCE_DELAY = 300;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useAuthState();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const textSearchFromStore = useSelector(selectTextSearch);
  const [localSearchValue, setLocalSearchValue] = useState(textSearchFromStore);

  const { hasUnread } = useNotifications(currentUser?.id ?? 1);

  const debouncedSearchValue = useDebounce(localSearchValue, SEARCH_DEBOUNCE_DELAY);

  const isOnMainPage = location.pathname === '/';

  useEffect(() => {
    dispatch(setTextSearch(debouncedSearchValue));

    if (isOnMainPage && debouncedSearchValue.trim()) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('search', debouncedSearchValue);
      navigate(`?${searchParams.toString()}`, { replace: true });
    }
  }, [debouncedSearchValue, dispatch, navigate, isOnMainPage]);

  useEffect(() => {
    setLocalSearchValue(textSearchFromStore);
  }, [textSearchFromStore]);

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
    dispatch(logout());
    setIsProfileMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setLocalSearchValue(value);

      if (!value.trim()) {
        dispatch(setTextSearch(''));
        if (isOnMainPage) {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.delete('search');
          navigate(`?${searchParams.toString()}`, { replace: true });
        }
      }
    },
    [dispatch, navigate, isOnMainPage]
  );

  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const searchValue = localSearchValue.trim();

      if (!searchValue) return;

      if (!isOnMainPage) {
        navigate(`/?search=${encodeURIComponent(searchValue)}`);
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('search', searchValue);
        navigate(`?${searchParams.toString()}`, { replace: true });
      }

      dispatch(setTextSearch(searchValue));
    },
    [localSearchValue, dispatch, navigate, isOnMainPage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  return (
    <header className={`${styles.header}`}>
      <Logo />
      <nav className={styles.navigation}>
        <a href="#about" className={`${styles.about}`}>
          О проекте
        </a>
        <AllSkillsDropdown />
      </nav>
      <SearchInput
        value={localSearchValue}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSearchSubmit}
        placeholder="Поиск по имени или навыку..."
      />
      {!isAuthenticated && <ThemeToggler />}
      <div
        className={`${styles['profile-panel']} ${isAuthenticated && styles['profile-panel--authenticated']}`}
      >
        {isAuthenticated && currentUser ? (
          <>
            <div className={styles['profile-icons']}>
              <ThemeToggler />
              <Dropdown
                trigger={<NotificationIcon hasUnread={hasUnread} />}
                align="right"
                isOpen={isNotificationPanelOpen}
                onToggle={handleToggleNotificationPanel}
              >
                <NotificationPanel userId={currentUser.id} onClose={handleCloseNotificationPanel} />
              </Dropdown>
              <Favorites />
            </div>
            <Dropdown
              trigger={
                <UserInfo userName={currentUser.name} userAvatarUrl={currentUser.avatarUrl} />
              }
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
            <Button
              variant="secondary"
              className={styles['sign-in']}
              title="Войти"
              onClick={handleAuthClick}
            />
            <Button
              variant="primary"
              className={styles['sign-up']}
              title="Зарегистрироваться"
              onClick={handleAuthClick}
            />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
