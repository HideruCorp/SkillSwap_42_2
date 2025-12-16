import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.scss';
function SideBar() {
  return (
    <ul className={styles.sideBar}>
      <li>
        <NavLink
          to="/profile/requests"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <img src="../../../src/shared/assets/img/request.svg" />
          Заявки
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/exchanges"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <img src="../../../src/shared/assets/img/message-Text.svg" />
          Мои обмены
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/favorites"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <img src="../../../src/shared/assets/img/like-Default.svg" />
          Избранное
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/skills"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <img src="../../../src/shared/assets/img/idea.svg" />
          Мои навыки
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <img src="../../../src/shared/assets/img/user.svg" />
          Личные данные
        </NavLink>
      </li>
    </ul>
  );
}

export default SideBar;
