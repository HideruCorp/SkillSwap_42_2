import type { ReactNode } from 'react';
import './Layout.scss';
import Header from '../header/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="container">
      <div className="wrapper">
        <Header />

        <main className="main">
          {/* TODO: Добавить Sidebar Component*/}
          <aside className="sidebar">Sidebar</aside>
          {/* Sidebar Component*/}

          <section className="content">{children}</section>
        </main>
      </div>
    </div>
  );
};

export default Layout;
