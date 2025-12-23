import { useEffect, useMemo, useState, useCallback } from 'react';
import type { JSX } from 'react';
import SectionUI from '@shared/ui/section/SectionUI';
import useInfiniteScroll from '@features/infinite-scroll/useInfiniteScroll';
import type { User, City, Category, Subcategory } from '@shared/types';
import filterUsers from '@entities/user/filterUsers';
import sortFilteredUsers from '@entities/user/sortFilteredUsers';
import paginate from '@entities/user/paginate';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import store, { useSelector } from '@app/store';

import { selectAllUsers } from '@entities/user';
import {
  selectAllSkillsMemoized,
  SkillCardContainer,
  sortSkills,
  recommendSkills,
} from '@entities/skill';
import { selectSkillLikesMap } from '@entities/favorites';
import { useAuthState } from '@features/auth';
import SortButton from '@widgets/sort-button';

type Mode = 'likes' | 'created' | 'recommended' | 'all';

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
  // Подписка на Store
  const users = useSelector(selectAllUsers);
  const skills = useSelector(selectAllSkillsMemoized);
  const { currentUser } = useAuthState();

  const [, setLoading] = useState(true);
  const [auxData, setAuxData] = useState<{
    cities: City[];
    categories: Category[];
    subcategories: Subcategory[];
  } | null>(null);

  // Memoize aux arrays to maintain stable references and prevent child component rerenders
  const aux = useMemo(() => auxData, [auxData]);
  const PAGE_SIZE = 10;

  const skillType = useSelector((state) => state.filters.skillType);
  const gender = useSelector((state) => state.filters.gender);
  const cities = useSelector((state) => state.filters.cities);
  const subcategories = useSelector((state) => state.filters.subcategories);
  const textSearch = useSelector((state) => state.filters.textSearch);
  const sortBy = useSelector((state) => state.sort.sortBy);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [citiesResponse, categoriesResponse] = await Promise.all([
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);
        if (!mounted) return;
        setAuxData({
          cities: citiesResponse,
          categories: categoriesResponse.categories,
          subcategories: categoriesResponse.subcategories,
        });
      } catch (e) {
        console.error('Ошибка загрузки вспомогательных данных', e);
      } finally {
        if (mounted) setLoading(false);
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
      skills,
      aux.cities,
      { categories: aux.categories, subcategories: aux.subcategories }
    );
  }, [users, aux, skillType, gender, cities, subcategories, textSearch, skills]);

  // NEW: Sort skills directly based on mode
  const sortedSkills = useMemo<number[]>(() => {
    if (!aux || filteredUsers.length === 0) return [];

    // Read fresh likes map from store (not in dependencies to prevent rerenders on like clicks)
    const currentLikesMap = selectSkillLikesMap(store.getState());

    // Get all skills for filtered users
    const filteredUserIds = new Set(filteredUsers.map((u) => u.id));
    const userSkills = skills.filter((skill) => filteredUserIds.has(skill.userId));

    let sorted: typeof skills;

    // Apply mode-specific sorting
    switch (mode) {
      case 'likes': {
        // Sort by popularity (most liked first)
        sorted = sortSkills(userSkills, 'likes', currentLikesMap);
        break;
      }

      case 'created': {
        // Sort by creation date (newest first)
        sorted = sortSkills(userSkills, 'created', currentLikesMap);
        break;
      }

      case 'recommended': {
        // Filter and sort by user interests
        sorted = recommendSkills(userSkills, currentUser?.skillInterests, currentLikesMap);
        break;
      }

      case 'all':
      default: {
        // Use global sort state for 'all' mode (filter results page)
        // First sort users, then extract skills to maintain user-based sorting
        const sortedUsers = sortFilteredUsers(filteredUsers, sortBy, skills, currentLikesMap);
        const skillIds = sortedUsers
          .map((user) => skills.filter((skill) => skill.userId === user.id).map((s) => s.id))
          .flat();
        return skillIds;
      }
    }

    return sorted.map((s) => s.id);
    // NOTE: Using memoized skills selector ensures stable reference.
    // This useMemo only recalculates when filters, mode, user interests,
    // or global sortBy change - not when individual skill properties like likes change.
    // likesMap is NOT in dependencies - we read fresh value from store inside useMemo
  }, [filteredUsers, mode, currentUser?.skillInterests, sortBy, aux, skills]);

  // Rename for clarity
  const visibleSkillIds = sortedSkills;

  const previewSkillIds = useMemo<number[]>(() => {
    return paginate(visibleSkillIds, 0, previewLimit);
  }, [visibleSkillIds, previewLimit]);

  const [page, setPage] = useState(0);
  const [visibleSkillIdsSlice, setVisibleSkillIdsSlice] = useState<number[]>([]);

  useEffect(() => {
    if (!infinite) return;
    setPage(0);
    setVisibleSkillIdsSlice(paginate(visibleSkillIds, 0, PAGE_SIZE));
  }, [visibleSkillIds, infinite]);

  useEffect(() => {
    if (!infinite) return;
    const currentCount = (page + 1) * PAGE_SIZE;
    setVisibleSkillIdsSlice(paginate(visibleSkillIds, 0, currentCount));
  }, [visibleSkillIds, infinite, page]);

  const loadMore = useCallback(() => {
    if (!infinite) return;
    const nextPage = page + 1;
    const nextSlice = paginate(visibleSkillIds, nextPage, PAGE_SIZE);
    if (nextSlice.length > 0) {
      setVisibleSkillIdsSlice((prev) => [...prev, ...nextSlice]);
      setPage(nextPage);
    }
  }, [infinite, page, visibleSkillIds]);

  const hasMore = infinite && visibleSkillIdsSlice.length < visibleSkillIds.length;
  const { targetRef } = useInfiniteScroll(loadMore, {
    enabled: infinite,
    rootMargin: '200px',
  });
  const skillIds = infinite ? visibleSkillIdsSlice : previewSkillIds;

  const handleOpenAll = useCallback(() => {
    // TODO: implement navigation to full list
  }, []);

  const displayTitle = useMemo(() => {
    if (showCount) {
      return `${title}: ${visibleSkillIds.length}`;
    }
    return title;
  }, [title, showCount, visibleSkillIds.length]);

  return (
    <SectionUI
      title={displayTitle}
      onAction={showAllButton ? handleOpenAll : undefined}
      actionLabel={showAllButton ? 'Смотреть все' : undefined}
      className={className}
      triggerRef={infinite ? targetRef : undefined}
      hasMore={hasMore}
      headerExtra={showSortButton ? <SortButton /> : undefined}
    >
      {skillIds.map((skillId) => (
        <SkillCardContainer
          key={skillId}
          skillId={skillId}
          categories={aux?.categories || []}
          subcategories={aux?.subcategories || []}
          cities={aux?.cities || []}
        />
      ))}
    </SectionUI>
  );
}
