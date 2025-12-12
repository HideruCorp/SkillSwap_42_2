import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import Header from '../header/Header';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  // так как разметка для главной страницы и для страниц регистрации и логина отличается, добавлено условие
  const location = useLocation();
  const isLoginOrRegisterPage = ['/login', '/register', '/error', '/register/step2', '/*'].some(
    (path) => location.pathname.includes(path)
  );

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
