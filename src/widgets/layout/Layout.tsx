import type { ReactNode } from 'react'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import styles from './Layout.module.scss'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
