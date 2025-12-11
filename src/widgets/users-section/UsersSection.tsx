import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type { JSX } from 'react';
import SectionUI from '@shared/ui/section/SectionUI';
import type { UserCardProps } from '@shared/ui/user-card/types';
import useInfiniteScroll from '@features/infinite-scroll/useInfiniteScroll';
import type { User } from '@shared/types';
import { sortUsersBy } from '@entities/user/sortUsers';
import buildUserCards from '@entities/user/buildUserCards';
import { paginate } from '@entities/user/paginate';
import getSkillsMock from '../../services/mockApi/skills';
import getCitiesMock from '../../services/mockApi/cities';
import getCategoriesMock from '../../services/mockApi/categories';

// Типы секций:
type Mode = 'likes' | 'created' | 'all';

type Props = {
  title: string;
  mode: Mode;
  previewLimit?: number;
  infinite?: boolean;
  showAllButton?: boolean;
  className?: string;
};

export default function UsersSection({
  title,
  mode,
  previewLimit = 3,
  infinite = false,
  showAllButton = false,
  className,
}: Props): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [aux, setAux] = useState<{ rawSkills: any[]; rawCities: any[]; rawCategories: any } | null>(
    null
  );
  const PAGE_SIZE = 10;

  // --------------------------------------------
  // 1. Загружаем пользователей (через твой mockApi)
  // --------------------------------------------
  useEffect(() => {
    let mounted = true;

    import('../../services/mockApi/users')
      .then(({ default: getUsersMock }) => getUsersMock())
      .then((raw) => {
        if (!mounted) return;
        const arr = Array.isArray(raw) ? raw : (raw.users ?? []);
        setUsers(arr);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

// --------------------------------------------
// 1b. Загружаем вспомогательные данные (skills/cities/categories)
// --------------------------------------------
useEffect(() => {
let mounted = true;
(async () => {
try {
const [skillsRes, citiesRes, categoriesRes] = await Promise.all([
getSkillsMock(),
getCitiesMock(),
getCategoriesMock(),
]);
if (!mounted) return;
const rawSkills = Array.isArray(skillsRes) ? skillsRes : (skillsRes.skills ?? []);
const rawCities = Array.isArray(citiesRes) ? citiesRes : (citiesRes.cities ?? []);
const rawCategories = categoriesRes;
setAux({ rawSkills, rawCities, rawCategories });
} catch (e) {
// eslint-disable-next-line no-console
console.error('Ошибка загрузки вспомогательных данных', e);
}
})();
return () => {
mounted = false;
};
}, []);

  // --------------------------------------------
  // 2. Сортировка по mode (используем твой sortUsersBy)
  // --------------------------------------------
  const sortedUsers = useMemo<User[]>(() => {
    if (mode === 'all') return users;
    return sortUsersBy(users, mode);
  }, [users, mode]);

  // --------------------------------------------
  // 3. Преобразование к карточкам (buildUserCards)
  // --------------------------------------------
  const allCards = useMemo<UserCardProps[]>(() => {
    if (!aux) return [];
    return buildUserCards(sortedUsers, aux.rawSkills, aux.rawCities, aux.rawCategories);
   }, [sortedUsers, aux]);

  // --------------------------------------------
  // 4. Preview (если infinite = false)
  // --------------------------------------------
  const previewCards = useMemo<UserCardProps[]>(() => {
    return paginate(allCards, 0, previewLimit);
  }, [allCards, previewLimit]);

  // --------------------------------------------
  // 5. Infinite scroll (если infinite = true)
  // --------------------------------------------
  const [page, setPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState<UserCardProps[]>([]);

  useEffect(() => {
    if (!infinite) return;

    setPage(0);
    setVisibleCards(paginate(allCards, 0, PAGE_SIZE)); // первая пачка
   }, [allCards, infinite]);

  const loadMore = useCallback(() => {
    if (!infinite) return;

   const nextPage = page + 1;
   const nextSlice = paginate(allCards, nextPage, PAGE_SIZE);

    if (nextSlice.length > 0) {
      setVisibleCards((prev) => [...prev, ...nextSlice]);
      setPage(nextPage);
    }
  }, [infinite, page, allCards]);

  const hasMore = infinite && visibleCards.length < allCards.length;

  const { targetRef } = useInfiniteScroll(loadMore, {
    enabled: infinite,
    rootMargin: '200px',
  });

  // --------------------------------------------
  // 6. Какая карточная выборка используется
  // --------------------------------------------
  const cards = infinite ? visibleCards : previewCards;

  // --------------------------------------------
  // 7. Кнопка «Смотреть все» (только если разрешена)
  // --------------------------------------------
  const handleOpenAll = useCallback(() => {
    console.log(`Открыть все: ${title}`);
  }, [title]);

  // --------------------------------------------
  // 8. Рендер
  // --------------------------------------------
  return (
    <SectionUI
      title={title}
      cards={cards}
      onAction={showAllButton ? handleOpenAll : undefined}
      actionLabel={showAllButton ? 'Смотреть все' : undefined}
      className={className}
      triggerRef={infinite ? targetRef : undefined}
      hasMore={hasMore}
    />
  );
}
