import { useEffect, useMemo, useRef, useState } from 'react';

import { SkillCardContainer } from '@entities/skill';
import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI';
import ArrowButton from '@shared/ui/arrow-button';
import type { Category, Subcategory, City } from '@shared/types';

import styles from './section-similar-offers.module.scss';

interface SectionSimilarOffersProps {
  title: string;
  skillIds: number[];
  categories: Category[];
  subcategories: Subcategory[];
  cities: City[];
  isLoading?: boolean;
}

const EPSILON = 1;
const SCROLL_DEBOUNCE_MS = 100;

function SectionSimilarOffers({
  title,
  skillIds,
  categories,
  subcategories,
  cities,
  isLoading = false,
}: SectionSimilarOffersProps) {
  /** ref на scroll-контейнер */
  const scrollRef = useRef<HTMLDivElement>(null);

  /** состояния */
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** генерируем стабильные ключи для скелетонов */
  const skeletonKeys = useMemo(() => Array.from({ length: 4 }, (_, i) => `skeleton-${i}`), []);

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
    if (!el) return undefined;

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
  }, [skillIds.length]);

  return (
    <section className={styles.section}>
      <SectionHeaderUI title={title} />

      {isLoading && (
        <div className={styles.slider}>
          {skeletonKeys.map((key) => (
            <div key={key} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {!isLoading && skillIds.length === 0 && (
        <div className={styles.empty}>Пока нет похожих предложений</div>
      )}

      {!isLoading && skillIds.length > 0 && (
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
            {skillIds.map((skillId) => (
              <SkillCardContainer
                key={skillId}
                skillId={skillId}
                categories={categories}
                subcategories={subcategories}
                cities={cities}
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
