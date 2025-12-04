// src/pages/MainPage/MainPage.tsx
import React, { type JSX } from 'react';
import InfiniteScroll from '../../features/infinite-scroll/components/InfiniteScroll';
import styles from './main-page.module.scss'; // заглушка: локальные стили для layout

export default function MainPage(): JSX.Element {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        {/* Здесь фильтры - пока заглушка */}
        <div style={{ padding: 16 }}>
          <h4>Фильтры</h4>
        </div>
      </aside>

      <section className={styles.content}>
        <h2 className={styles.title}>Популярное</h2>

        <InfiniteScroll />

        {/* Добавить другие разделы или компоненты слева */}
      </section>
    </main>
  );
}
