import { useEffect, useRef, useState } from 'react';

import UserCard from '@shared/ui/user-card/UserCard';
import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI';
import ArrowButton from '@shared/ui/arrow-button/ArrowButton';
import type { UserCardProps } from '@shared/ui/user-card/types';
import { useFavorites } from '@features/favorites';

import styles from './section-similar-offers.module.scss';

interface SectionSimilarOffersProps {
  title: string;
  cards: UserCardProps[];
  isLoading?: boolean;
  onDetailsClick?: (id: number) => void;
}

const EPSILON = 1;
const SCROLL_DEBOUNCE_MS = 100;

function SectionSimilarOffers({
  title,
  cards,
  onDetailsClick,
  isLoading = false,
}: SectionSimilarOffersProps) {
  /** ref на scroll-контейнер */
  const scrollRef = useRef<HTMLDivElement>(null);

  /** состояния */
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** проверка возможности скролла */
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    const scrollable = scrollWidth > clientWidth + EPSILON;
    setIsScrollable(scrollable);

    if (!scrollable) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - EPSILON);
  };

  /** скролл влево — на ширину контейнера */
  const handleScrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: -el.clientWidth,
      behavior: 'smooth',
    });
  };

  /** скролл вправо — на ширину контейнера */
  const handleScrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: el.clientWidth,
      behavior: 'smooth',
    });
  };

  /** scroll + resize listeners */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeoutId: number | null = null;

    const onScroll = () => {
      if (timeoutId) window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        updateScrollState();
      }, SCROLL_DEBOUNCE_MS);
    };

    updateScrollState();

    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [cards.length]);

  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <section className={styles.section}>
      <SectionHeaderUI title={title} />

      {isLoading ? (
        <div className={styles.slider}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className={styles.empty}>
          Пока нет похожих предложений
        </div>
      ) : (
        <div className={styles.wrapper}>
          {isScrollable && canScrollLeft && (
            <ArrowButton
              direction="left"
              onClick={handleScrollLeft}
              className={styles.arrowLeft}
              ariaLabel="Прокрутить влево"
            />
          )}

          <div className={styles.slider} ref={scrollRef}>
            {cards.map((card) => (
              <UserCard
                key={card.id}
                {...card}
                isLiked={isFavorite(card.mainSkillId)}
                onLikeClick={() => toggleFavorite(card.mainSkillId)}
                onDetailsClick={onDetailsClick}
              />
            ))}
          </div>

          {isScrollable && canScrollRight && (
            <ArrowButton
              direction="right"
              onClick={handleScrollRight}
              className={styles.arrowRight}
              ariaLabel="Прокрутить вправо"
            />
          )}
        </div>
      )}
    </section>
  );
}

export default SectionSimilarOffers;
