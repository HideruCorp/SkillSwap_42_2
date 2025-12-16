import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import usersApi from '@entities/user/api/usersApi';
import skillsApi from '@entities/skill/api/skillsApi';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import type { UserCardProps } from '../../shared/ui/user-card/types';
import UserCard from '../../shared/ui/user-card/UserCard';
import useInfiniteScroll from './useInfiniteScroll';
import buildUserCards from '../../entities/user/buildUserCards';
import styles from './scroll.module.scss';

/**
 * InfiniteScroll:
 * - подгружает данные через entities API (users, skills, cities, categories)
 * - мапит пользователей в UserCardProps
 * - рендерит чанки (pageSize) и подгружает следующий чанк при intersection
 */

const PAGE_SIZE = Infinity; // сколько карточек подгружаем за раз — исправить, если нужно другое значение

export default function InfiniteScroll(): JSX.Element {
  const [allUsers, setAllUsers] = useState<UserCardProps[]>([]);
  const [visibleItems, setVisibleItems] = useState<UserCardProps[]>([]);
  const [page, setPage] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const loadingInitialRef = useRef(false);
  const mountedRef = useRef(true);

  // загрузка всех данных при монтировании
  useEffect(() => {
    let mounted = true;
    loadingInitialRef.current = true;
    setLoadingInitial(true);

    (async () => {
      try {
        const [rawUsers, rawSkills, rawCities, categoriesData] = await Promise.all([
          usersApi.getUsers(),
          skillsApi.getSkills(),
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);

        const mapped = buildUserCards(rawUsers, rawSkills, rawCities, categoriesData);

        if (!mounted) return;
        setAllUsers(mapped);
        setVisibleItems(mapped.slice(0, PAGE_SIZE));
        setPage(1);
      } catch (err) {
        console.error('Ошибка при загрузке данных для InfiniteScroll:', err);
      } finally {
        loadingInitialRef.current = false;
        setLoadingInitial(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingInitialRef.current) return;
    const start = page * PAGE_SIZE;
    if (start >= allUsers.length) return;

    // безопасная задержка: используем window.setTimeout чтобы избежать конфликтов типов
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 300);
    });

    // если компонент уже размонтирован — ничего не делаем
    if (!mountedRef.current) return;

    const next = allUsers.slice(start, start + PAGE_SIZE);
    setVisibleItems((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
  }, [allUsers, page]);

  const { targetRef } = useInfiniteScroll(loadMore, {
    rootMargin: '200px',
    threshold: 0.1,
    enabled: true,
  });

  const hasMore = visibleItems.length < allUsers.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {loadingInitial &&
          Array.from({ length: 6 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`skeleton-${i}`} className={styles.card}>
              <div style={{ height: 140, background: '#f4f4f4', borderRadius: 8 }} />
            </div>
          ))}
        {!loadingInitial &&
          visibleItems.map((userProps) => (
            <UserCard
              key={userProps.id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...userProps}
              // onDetailsClick={() => console.log('Подробнее:', userProps)}
              onLikeClick={() => console.log('Like:', userProps.id)}
            />
          ))}
      </div>

      {hasMore && (
        <div ref={targetRef} className={styles.trigger}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      )}

      {!hasMore && !loadingInitial && <div className={styles.end}>Все карточки загружены</div>}
    </div>
  );
}
