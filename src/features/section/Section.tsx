import React, { useCallback, useEffect, useState } from 'react';
import SectionUI from '@shared/ui/section/SectionUI';
import useInfiniteScroll from '@features/infinite-scroll/useInfiniteScroll';
import type { UserCardProps } from '@shared/ui/user-card/types';
import usersApi from '@entities/user/api/usersApi';
import skillsApi from '@entities/skill/api/skillsApi';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import buildUserCards from '@entities/user/buildUserCards';
import { sortUsersBy } from '@entities/user/sortUsers';
import { paginate } from '@entities/user/paginate';

export type SectionType = 'popular' | 'new' | 'recommended';

type SectionProps = {
  type: SectionType;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

const PAGE_SIZE = 12;

function Section({ type, title, actionLabel, onAction }: SectionProps) {
  const [allRawUsers, setAllRawUsers] = useState<any[]>([]);
  const [cards, setCards] = useState<UserCardProps[]>([]);
  const [page, setPage] = useState(0);

  // загрузить исходные данные + вспомогательные один раз
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rawUsers, rawSkills, rawCities, categoriesData] = await Promise.all([
          usersApi.getUsers(),
          skillsApi.getSkills(),
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);

        if (!mounted) return;

        // сохраняем исходных пользователей и вспомогательные данные в refs/state
        // будем хранить вспомогательные данные в замыкании, захватив их здесь
        (window as any).__SECTION_AUX__ = {
          rawSkills,
          rawCities,
          rawCategories: categoriesData,
        };

        setAllRawUsers(rawUsers);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Для популярных/новых: вычислить топ-3 и сопоставить
  useEffect(() => {
    if (!allRawUsers.length) return;

    const aux = (window as any).__SECTION_AUX__;
    if (!aux) return;

    if (type === 'popular') {
      const sorted = sortUsersBy(allRawUsers, 'likes').slice(0, 3);
      const mapped = buildUserCards(sorted, aux.rawSkills, aux.rawCities, aux.rawCategories);
      setCards(mapped);
    } else if (type === 'new') {
      const sorted = sortUsersBy(allRawUsers, 'created').slice(0, 3);
      const mapped = buildUserCards(sorted, aux.rawSkills, aux.rawCities, aux.rawCategories);
      setCards(mapped);
    } else if (type === 'recommended') {
      // рекомендуется сброс при переключении
      setCards([]);
      setPage(0);
      // загрузить первую страницу
      const first = paginate(allRawUsers, 0, PAGE_SIZE);
      const mapped = buildUserCards(first, aux.rawSkills, aux.rawCities, aux.rawCategories);
      setCards(mapped);
      setPage(1);
    }
  }, [allRawUsers, type]);

  // загрузить больше для recommended
  const loadRecommendedPage = useCallback(async () => {
    if (type !== 'recommended') return;
    const aux = (window as any).__SECTION_AUX__;
    if (!aux) return;
    const next = paginate(allRawUsers, page, PAGE_SIZE);
    if (!next.length) return;
    const mapped = buildUserCards(next, aux.rawSkills, aux.rawCities, aux.rawCategories);
    setCards((prev) => [...prev, ...mapped]);
    setPage((p) => p + 1);
  }, [allRawUsers, page, type]);

  // прикрепить infinite scroll (возвращает setter ref)
  const { targetRef } = useInfiniteScroll(loadRecommendedPage, { enabled: type === 'recommended' });

  const hasMore = cards.length < allRawUsers.length;

  return (
    <SectionUI
      title={title}
      cards={cards}
      actionLabel={actionLabel}
      onAction={onAction}
      triggerRef={targetRef}
      hasMore={hasMore}
      onDetailsClick={(id) => console.log('open details', id)}
      onLikeClick={(id) => console.log('like', id)}
    />
  );
}

export default Section;
