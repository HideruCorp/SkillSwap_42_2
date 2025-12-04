import type { ReactNode } from 'react';
import './Layout.scss';
import Header from '../header/Header';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="container">
      <div className="wrapper">
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
