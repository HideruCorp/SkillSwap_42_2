import { Link } from 'react-router-dom';
import LogoutIcon from '@shared/assets/img/logout.svg?react';
import styles from './profile-menu.module.scss';

interface ProfileMenuProps {
  onLinkClick?: () => void;
  handleLogout: () => void;
}

function ProfileMenu({ onLinkClick, handleLogout }: ProfileMenuProps) {
  return (
    <nav className={styles['menu-list']}>
      <Link to="/profile" className={styles.link} onClick={onLinkClick}>
        Личный кабинет
      </Link>

      <button type="button" className={styles['logout-button']} onClick={handleLogout}>
        Выйти из аккаунта
        <span className={styles.icon}>
          <LogoutIcon />
        </span>
      </button>
    </nav>
  );
}

ProfileMenu.defaultProps = {
  onLinkClick: undefined,
};

export default ProfileMenu;
