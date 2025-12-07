/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import UserCard from '../../../shared/ui/user-card/UserCard';
import type { UserCardProps } from '../../../shared/ui/user-card/types';
import type { SkillTag } from '../../../shared/ui/skill-tag-list/type';
import getUsersMock from '../../../services/mockApi/users';
import getSkillsMock from '../../../services/mockApi/skills';
import getCitiesMock from '../../../services/mockApi/cities';
import getCategoriesMock from '../../../services/mockApi/categories';
import styles from '../styles/scroll.module.scss';

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

type RawUser = {
  id: number | string;
  avatarUrl?: string | null;
  name?: string;
  about?: string;
  cityId?: number;
  dateOfBirth?: string;
  skillInterests?: number[];
};

type RawSkill = {
  id: number;
  subcategoryId?: number;
  userId: number;
  title: string;
};

type RawCity = { id: number; name: string };
type RawCategory = { id: number; name: string; color: string };
type RawSubcategory = { id: number; name: string; categoryId: number };
type RawCategoriesJson = {
  categories: RawCategory[];
  subcategories: RawSubcategory[];
};

const PAGE_SIZE = 15; // сколько карточек подгружаем за раз — подскажи, если нужно другое значение

export default function InfiniteScroll(): JSX.Element {
  const [allUsers, setAllUsers] = useState<UserCardProps[]>([]);
  const [visibleItems, setVisibleItems] = useState<UserCardProps[]>([]);
  const [page, setPage] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const loadingInitialRef = useRef(false);

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

        // Твой mockApi, судя по предыдущему коду, возвращает объект с ключом, например { users: [...] }.
        // Обрабатываем оба варианта: либо { users: [...] }, либо сам массив.
        const rawUsers: RawUser[] = Array.isArray(usersRes) ? usersRes : (usersRes.users ?? []);
        const rawSkills: RawSkill[] = Array.isArray(skillsRes)
          ? skillsRes
          : (skillsRes.skills ?? []);
        const rawCities: RawCity[] = Array.isArray(citiesRes)
          ? citiesRes
          : (citiesRes.cities ?? []);
        const rawCategories: RawCategoriesJson = categoriesRes;

        const categories = rawCategories?.categories || [];
        const subcategories = rawCategories?.subcategories || [];

        const getCategoryColorBySubcategoryId = (subcategoryId: number): string => {
          const subcategory = subcategories.find((sc) => sc.id === subcategoryId);
          if (!subcategory) return '#EEE7F7';
          const category = categories.find((c) => c.id === subcategory.categoryId);
          return category?.color || '#EEE7F7';
        };

        // мапим пользователей в пропсы, которые ожидает UserCard
        // предполагается, что rawUsers: RawUser[], rawSkills: RawSkill[], subcategories: { id: number; name: string }[]
        const mapped: UserCardProps[] = rawUsers.map((u) => {
          const id = typeof u.id === 'number' ? u.id : Number(u.id);

          const userSkillsRaw = rawSkills.filter((s) => s.userId === id);
          const canTeach: SkillTag[] = userSkillsRaw.map((skill) => ({
            id: String(skill.id),
            text: skill.title,
            bgColor: getCategoryColorBySubcategoryId(skill.subcategoryId || 0),
          }));

          const wantsToLearn: SkillTag[] =
            Array.isArray(u.skillInterests) && u.skillInterests.length > 0
              ? u.skillInterests
                  .map((sid) => {
                    const subcategory = subcategories.find((sc) => sc.id === sid);
                    if (!subcategory) return null;
                    return {
                      id: String(sid),
                      text: subcategory.name,
                      bgColor: getCategoryColorBySubcategoryId(sid),
                    };
                  })
                  .filter((tag): tag is SkillTag => tag !== null)
              : [];

          let age = 0;
          if (u.dateOfBirth) {
            const dob = new Date(u.dateOfBirth);
            const now = new Date();
            age = now.getFullYear() - dob.getFullYear();
            const m = now.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
          }

          return {
            name: u.name ?? 'Без имени',
            city:
              (typeof u.cityId === 'number' && rawCities?.find((c) => c.id === u.cityId)?.name) ||
              'Город не указан',
            age,
            canTeach,
            wantsToLearn,
            avatarUrl: u.avatarUrl ?? null,
          };
        });

        if (!mounted) return;
        setAllUsers(mapped);
        // initial render — первый чанк
        setVisibleItems(mapped.slice(0, PAGE_SIZE));
        setPage(1);
      } catch (err) {
        // в реальном проекте — показать UI-ошибку
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

  // функция подгрузки следующей порции данных
  const loadMore = useCallback(async () => {
    if (loadingInitialRef.current) return;
    const start = page * PAGE_SIZE;
    if (start >= allUsers.length) return;
    const next = allUsers.slice(start, start + PAGE_SIZE);
    // имитируем задержку сети для UX
    await new Promise((r) => {
      setTimeout(r, 300);
    });
    setVisibleItems((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
  }, [allUsers, page]);

  // подключаем IntersectionObserver
  const { targetRef } = useInfiniteScroll(loadMore, {
    rootMargin: '200px',
    threshold: 0.1,
    enabled: true,
  });

  const hasMore = visibleItems.length < allUsers.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* если данные ещё не загружены — можно показать skeletons */}
        {loadingInitial &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className={styles.card}>
              {/* простая заглушка; ты можешь заменить на UserCardSkeleton */}
              <div style={{ height: 140, background: '#f4f4f4', borderRadius: 8 }} />
            </div>
          ))}
        {!loadingInitial &&
          visibleItems.map((userProps, idx) => (
            <UserCard
              // у нас нет id в UserCardProps, поэтому use index — лучше заменить, если id потребуется
              key={`${userProps.name}-${idx}`}
              {...userProps}
              onDetailsClick={() => {
                // заглушка — можно открыть popup или navigate
                console.log('Подробнее:', userProps.name);
              }}
              onLikeClick={() => {
                console.log('Like:', userProps.name);
              }}
            />
          ))}
      </div>

      {/* триггер для intersection observer */}
      {hasMore && (
        <div ref={targetRef} className={styles.trigger}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      )}

      {/* сообщение о конце ленты карточек */}
      {!hasMore && !loadingInitial && <div className={styles.end}>Все карточки загружены</div>}
    </div>
  );
}
