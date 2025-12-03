import type { ReactNode } from 'react';
import './Layout.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="container">
      <div className="wrapper">
        {/* TODO: Добавить Header Component*/}
        <header className="header">Header</header>
        {/* Header Component*/}

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
