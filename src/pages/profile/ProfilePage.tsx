import type { ReactElement } from 'react';
import styles from './profile-page.module.scss';
import SideBar from './sideBar/SideBar';

interface ProfilePageProps {
  children: ReactElement | string;
}

function ProfilePage({ children }: ProfilePageProps) {
  return (
    <section className={styles.profile}>
      <SideBar />

      {children}
    </section>
  );
}

export default ProfilePage;
