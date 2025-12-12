import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@shared/ui/logo/Logo';
import { SearchInput } from '@shared/ui/search';
import Button from '@shared/ui/button/Button';
import Dropdown from '@shared/ui/dropdown';
import ProfileMenu from '@widgets/header/profile/profile-menu';
import { NotificationIcon, NotificationPanel, useNotifications } from '@features/notifications';
import { useDebounce } from '@shared/hooks/useDebounce';
import styles from './header.module.scss';
import ThemeToggler from './theme-toggler/ThemeToggler';
import AllSkillsDropdown from './all-skills-dropdown/AllSkillsDropdown';
import Favorites from './favorites/Favorites';
import UserInfo from './userInfo/UserInfo';
import { useDispatch, useSelector } from '../../services/store';
import { selectTextSearch } from '../../services/slices/filtersSlice/selectors';
import { setTextSearch } from '../../services/slices/filtersSlice';

// TODO: Заменить на ID авторизованного пользователя
const CURRENT_USER_ID = 1;
// Константа для задержки debounce
const SEARCH_DEBOUNCE_DELAY = 1500;

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authenticated] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Получаем текущее значение поиска из store
  const textSearchFromStore = useSelector(selectTextSearch);
  const [localSearchValue, setLocalSearchValue] = useState(textSearchFromStore);

  const { hasUnread } = useNotifications(CURRENT_USER_ID);

  // Используем debounce для значения поиска
  const debouncedSearchValue = useDebounce(localSearchValue, SEARCH_DEBOUNCE_DELAY);

  // Обновляем store при изменении debounced значения
  useEffect(() => {
    dispatch(setTextSearch(debouncedSearchValue));
  }, [debouncedSearchValue, dispatch]);

  // Синхронизируем локальное состояние с store при изменении снаружи
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
    // TODO: Добавить логику выхода из аккаунта
    setIsProfileMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocalSearchValue(value);
  }, []);

  return (
    <header className={`${styles.header}`}>
      <Logo />
      <nav className={styles.navigation}>
        <a href="#about" className={`${styles.about}`}>
          О проекте
        </a>
        <AllSkillsDropdown />
      </nav>
      <SearchInput value={localSearchValue} onChange={handleSearchChange} />
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
            <Button
              type="secondary"
              className={styles['sign-in']}
              title="Войти"
              onClick={handleAuthClick}
            />
            <Button
              type="primary"
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
