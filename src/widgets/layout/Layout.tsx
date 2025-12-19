import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Layout.module.scss';
import Header from '../header/Header';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: ReactNode;
  withGrid?: boolean;
}

const cx = classNames.bind(styles);

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/register/') ||
    ['/auth', '/error'].some((path) => location.pathname.includes(path));

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Header />
        <main
          className={cx(styles.main, {
            mainLogin: isAuthPage, 
            mainGrid: !isAuthPage,
          })}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
