import { NavLink } from 'react-router-dom';
import RequestIcon from '@shared/assets/img/request.svg?react';
import MessageIcon from '@shared/assets/img/message-Text.svg?react';
import LikeIcon from '@shared/assets/img/like-Default.svg?react';
import IdeaIcon from '@shared/assets/img/idea.svg?react';
import UserIcon from '@shared/assets/img/user.svg?react';
import styles from './sidebar.module.scss';

function SideBar() {
  return (
    <ul className={styles.sideBar}>
      <li>
        <NavLink
          to="/profile/requests"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <RequestIcon />
          Заявки
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/exchanges"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <MessageIcon />
          Мои обмены
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/favorites"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <LikeIcon />
          Избранное
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile/skills"
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <IdeaIcon />
          Мои навыки
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) => (isActive ? `${styles.active} ${styles.item}` : styles.item)}
        >
          <UserIcon />
          Личные данные
        </NavLink>
      </li>
    </ul>
  );
}

export default SideBar;
