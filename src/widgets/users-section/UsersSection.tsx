import { useEffect, useMemo, useState, useCallback } from 'react';
import type { JSX } from 'react';
import SectionUI from '@shared/ui/section/SectionUI';
import type { UserCardProps } from '@shared/ui/user-card/types';
import useInfiniteScroll from '@features/infinite-scroll/useInfiniteScroll';
import type { User } from '@shared/types';
import buildUserCards from '@entities/user/buildUserCards';
import filterUsers from '@entities/user/filterUsers';
import sortFilteredUsers from '@entities/user/sortFilteredUsers';
import { paginate } from '@entities/user/paginate';
import getSkillsMock from '../../services/mockApi/skills';
import getCitiesMock from '../../services/mockApi/cities';
import getCategoriesMock from '../../services/mockApi/categories';
import { useSelector } from '../../services/store';

// Типы секций:
type Mode = 'likes' | 'created' | 'all';

type Props = {
  title: string;
  mode: Mode;
  previewLimit?: number;
  infinite?: boolean;
  showAllButton?: boolean;
  className?: string;
  showCount?: boolean;
};

export default function UsersSection({
  title,
  mode,
  previewLimit = 3,
  infinite = false,
  showAllButton = false,
  className,
  showCount = false,
}: Props): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [aux, setAux] = useState<{ rawSkills: any[]; rawCities: any[]; rawCategories: any } | null>(
    null
  );
  const PAGE_SIZE = 10;

  // Получаем фильтры из Redux store
  const skillType = useSelector((state) => state.filters.skillType);
  const gender = useSelector((state) => state.filters.gender);
  const cities = useSelector((state) => state.filters.cities);
  const subcategories = useSelector((state) => state.filters.subcategories);
  const textSearch = useSelector((state) => state.filters.textSearch);

  // Получаем опцию сортировки из Redux store
  const sortBy = useSelector((state) => state.sort.sortBy);

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
  // 2. Применяем фильтры
  // --------------------------------------------
  const filteredUsers = useMemo<User[]>(() => {
    if (!aux) return users;
    return filterUsers(
      users,
      {
        skillType,
        gender,
        cities,
        subcategories,
        textSearch,
      },
      aux.rawSkills,
      aux.rawCities,
      aux.rawCategories
    );
  }, [users, aux, skillType, gender, cities, subcategories, textSearch]);

  // --------------------------------------------
  // 2b. Применяем сортировку к отфильтрованным пользователям
  // Сортировка из Redux применяется ко всем секциям
  // --------------------------------------------
  const sortedFilteredUsers = useMemo<User[]>(() => {
    if (!aux || filteredUsers.length === 0) return filteredUsers;
    
    // Применяем сортировку из Redux ко всем секциям
    return sortFilteredUsers(filteredUsers, sortBy, aux.rawSkills);
  }, [filteredUsers, sortBy, aux]);

  // --------------------------------------------
  // 3. Преобразование к карточкам (buildUserCards)
  // --------------------------------------------
  const allCards = useMemo<UserCardProps[]>(() => {
    if (!aux) return [];
    return buildUserCards(sortedFilteredUsers, aux.rawSkills, aux.rawCities, aux.rawCategories);
   }, [sortedFilteredUsers, aux]);

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
    // TODO: implement navigation to full list
  }, [title]);

  // --------------------------------------------
  // 8. Формируем заголовок с количеством (если нужно)
  // --------------------------------------------
  const displayTitle = useMemo(() => {
    if (showCount) {
      return `${title}: ${allCards.length}`;
    }
    return title;
  }, [title, showCount, allCards.length]);

  // --------------------------------------------
  // 9. Рендер
  // --------------------------------------------
  return (
    <SectionUI
      title={displayTitle}
      cards={cards}
      onAction={showAllButton ? handleOpenAll : undefined}
      actionLabel={showAllButton ? 'Смотреть все' : undefined}
      className={className}
      triggerRef={infinite ? targetRef : undefined}
      hasMore={hasMore}
    />
  );
}