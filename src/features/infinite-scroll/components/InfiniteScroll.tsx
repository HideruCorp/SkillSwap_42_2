import { useState, useCallback } from 'react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import styles from '../styles/scroll.module.scss';

interface FakeCard {
  id: number;
  title: string;
}

// имитируем API
const loadMock = async (page: number, limit = 12) => {
  await new Promise((res) => {
    setTimeout(res, 600);
  });
  const data = Array.from({ length: limit }, (_, i) => ({
    id: page * limit + i + 1,
    title: `Заглушка карточки №${page * limit + i + 1}`,
  }));

  return {
    data,
    hasMore: page < 5, // ограничим 5 страниц
  };
};

export default function InfiniteScroll() {
  const [items, setItems] = useState<FakeCard[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const { data, hasMore: more } = await loadMock(page);

    setItems((prev) => [...prev, ...data]);
    setPage((prev) => prev + 1);
    setHasMore(more);
    setLoading(false);
  }, [page, loading, hasMore]);

  const { targetRef } = useInfiniteScroll(loadMore, {
    enabled: !loading && hasMore,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((card) => (
          <div key={card.id} className={styles.card}>
            {card.title}
          </div>
        ))}
      </div>

      {loading && <div className={styles.loading}>Загрузка...</div>}

      {hasMore && <div ref={targetRef} className={styles.trigger} />}

      {!hasMore && <div className={styles.end}>Все данные загружены</div>}
    </div>
  );
}
