import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import useInfiniteScroll from './useInfiniteScroll';
import UserCard from '../../shared/ui/user-card/UserCard';
import type { UserCardProps } from '../../shared/ui/user-card/types';
import getUsersMock from '../../services/mockApi/users';
import getSkillsMock from '../../services/mockApi/skills';
import getCitiesMock from '../../services/mockApi/cities';
import getCategoriesMock from '../../services/mockApi/categories';
import type { RawUser, RawSkill, RawCity } from './types';
import buildUserCards from '../../entities/user/buildUserCards';
import styles from './scroll.module.scss';

/**
 * InfiniteScroll:
 * - подгружает моковые файлы (users, skills, cities, categories)
 * - мапит пользователей в UserCardProps
 * - рендерит чанки (pageSize) и подгружает следующий чанк при intersection
 *
 * Замечания:
 * - mockApi-функции ожидаются как default export, возвращающие объект { users: [...] } и т.д.
 * - если структура mockApi отличается — поправь чтение (см. comments ниже).
 */

const PAGE_SIZE = Infinity; // сколько карточек подгружаем за раз — исправить, если нужно другое значение

export default function InfiniteScroll(): JSX.Element {
  const [allUsers, setAllUsers] = useState<UserCardProps[]>([]);
  const [visibleItems, setVisibleItems] = useState<UserCardProps[]>([]);
  const [page, setPage] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const loadingInitialRef = useRef(false);
  const mountedRef = useRef(true);

  // загрузка всех моковых данных при монтировании
  useEffect(() => {
    let mounted = true;
    loadingInitialRef.current = true;
    setLoadingInitial(true);

    (async () => {
      try {
        const [usersRes, skillsRes, citiesRes, categoriesRes] = await Promise.all([
          getUsersMock(),
          getSkillsMock(),
          getCitiesMock(),
          getCategoriesMock(),
        ]);

        const rawUsers: RawUser[] = Array.isArray(usersRes) ? usersRes : (usersRes.users ?? []);
        const rawSkills: RawSkill[] = Array.isArray(skillsRes)
          ? skillsRes
          : (skillsRes.skills ?? []);
        const rawCities: RawCity[] = Array.isArray(citiesRes)
          ? citiesRes
          : (citiesRes.cities ?? []);
        const rawCategories = categoriesRes;

        const mapped = buildUserCards(rawUsers, rawSkills, rawCities, rawCategories);

        if (!mounted) return;
        setAllUsers(mapped);
        setVisibleItems(mapped.slice(0, PAGE_SIZE));
        setPage(1);
      } catch (err) {
        console.error('Ошибка при загрузке моков для InfiniteScroll:', err);
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
