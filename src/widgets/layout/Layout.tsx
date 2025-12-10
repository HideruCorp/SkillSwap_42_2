import type { ReactNode } from 'react';
import './Layout.scss';
import Header from '../header/Header';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <div className="wrapper">
        <Header />
        <main className="main">{children}</main>

         
        
      </div>
    </div>
  );
}

export default Layout;
