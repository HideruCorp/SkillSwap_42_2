export function useInfinitePagination(allItems, pageSize = 20) {
  const [visible, setVisible] = useState(allItems.slice(0, pageSize));
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    const start = page * pageSize;
    if (start >= allItems.length) return;

    const next = allItems.slice(start, start + pageSize);
    setVisible((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
  }, [allItems, page, pageSize]);

  const hasMore = visible.length < allItems.length;

  return { visible, loadMore, hasMore };
}
