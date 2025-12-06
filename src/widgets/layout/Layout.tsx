import type { ReactNode } from 'react';
import './Layout.scss';
import { useLocation } from 'react-router-dom';
import Header from '../header/Header';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  // так как разметка для главной страницы и для страниц регистрации и логина отличается, добавлено условие
  const location = useLocation();
  const isLoginOrRegisterPage =
    location.pathname.includes('login') || location.pathname.includes('register');

  return (
    <div className="container">
      <div className="wrapper">
        <Header />
        <main className={isLoginOrRegisterPage ? 'mainLogin' : 'main'}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
