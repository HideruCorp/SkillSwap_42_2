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
import usersApi from '@entities/user/api/usersApi';
import skillsApi from '@entities/skill/api/skillsApi';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import { useFavorites } from '@features/favorites/hooks/useFavorites';
import { useSelector } from '@app/store';
import SortButton from '@widgets/sort-button';

type Mode = 'likes' | 'created' | 'all';

type Props = {
  title: string;
  mode: Mode;
  previewLimit?: number;
  infinite?: boolean;
  showAllButton?: boolean;
  className?: string;
  showCount?: boolean;
  showSortButton?: boolean;
};

export default function UsersSection({
                                       title,
                                       mode,
                                       previewLimit = 3,
                                       infinite = false,
                                       showAllButton = false,
                                       className,
                                       showCount = false,
                                       showSortButton = false,
                                     }: Props): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [aux, setAux] = useState<{ rawSkills: any[]; rawCities: any[]; rawCategories: any } | null>(
    null
  );
  const PAGE_SIZE = 10;

  const { toggleFavorite, isFavorite } = useFavorites();

  const skillType = useSelector((state) => state.filters.skillType);
  const gender = useSelector((state) => state.filters.gender);
  const cities = useSelector((state) => state.filters.cities);
  const subcategories = useSelector((state) => state.filters.subcategories);
  const textSearch = useSelector((state) => state.filters.textSearch);
  const sortBy = useSelector((state) => state.sort.sortBy);

  useEffect(() => {
    let mounted = true;

    usersApi.getUsers()
      .then((fetchedUsers) => {
        if (!mounted) return;
        setUsers(fetchedUsers);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rawSkills, rawCities, categoriesData] = await Promise.all([
          skillsApi.getSkills(),
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);
        if (!mounted) return;
        setAux({ rawSkills, rawCities, rawCategories: categoriesData });
      } catch (e) {
        console.error('Ошибка загрузки вспомогательных данных', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  const sortedFilteredUsers = useMemo<User[]>(() => {
    if (!aux || filteredUsers.length === 0) return filteredUsers;
    return sortFilteredUsers(filteredUsers, sortBy, aux.rawSkills);
  }, [filteredUsers, sortBy, aux]);

  const allCards = useMemo<UserCardProps[]>(() => {
    if (!aux) return [];
    return buildUserCards(sortedFilteredUsers, aux.rawSkills, aux.rawCities, aux.rawCategories);
  }, [sortedFilteredUsers, aux]);

  const previewCards = useMemo<UserCardProps[]>(() => {
    return paginate(allCards, 0, previewLimit);
  }, [allCards, previewLimit]);

  const [page, setPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState<UserCardProps[]>([]);

  useEffect(() => {
    if (!infinite) return;
    setPage(0);
    setVisibleCards(paginate(allCards, 0, PAGE_SIZE));
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
  const cards = infinite ? visibleCards : previewCards;

  const handleLikeClick = useCallback((userId: number) => {
    toggleFavorite(userId);
  }, [toggleFavorite]);

  const handleOpenAll = useCallback(() => {
    // TODO: implement navigation to full list
  }, [title]);

  const displayTitle = useMemo(() => {
    if (showCount) {
      return `${title}: ${allCards.length}`;
    }
    return title;
  }, [title, showCount, allCards.length]);

  return (
    <SectionUI
      title={displayTitle}
      cards={cards}
      onAction={showAllButton ? handleOpenAll : undefined}
      actionLabel={showAllButton ? 'Смотреть все' : undefined}
      className={className}
      triggerRef={infinite ? targetRef : undefined}
      hasMore={hasMore}
      headerExtra={showSortButton ? <SortButton /> : undefined}
      onLikeClick={handleLikeClick}
      isFavorite={isFavorite}
    />
  );
}