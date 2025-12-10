import React, { type JSX } from 'react';
import UsersSection from '../../widgets/users-section/UsersSection';
import InfiniteScroll from '../../features/infinite-scroll/InfiniteScroll';
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
        <UsersSection
          title="Популярное"
          mode="likes"
          previewLimit={3}
          infinite={false}
          showAllButton
        />

        <UsersSection
          title="Новое"
          mode="created"
          previewLimit={3}
          infinite={false}
          showAllButton
        />

        <UsersSection title="Рекомендуем" mode="created" infinite previewLimit={20} />
      </section>
    </main>
  );
}
