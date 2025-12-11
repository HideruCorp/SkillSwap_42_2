import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import Header from '../header/Header';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Header />
        <main className={isLoginOrRegisterPage ? styles.mainLogin : styles.main}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
