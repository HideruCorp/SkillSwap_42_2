/**
 * Обертка для кэширования Promise.
 * Если запрос уже летит, возвращает тот же Promise.
 * Если запрос завершился успешно, возвращает сохраненный результат.
 * Если произошла ошибка, сбрасывает кэш, чтобы можно было попробовать снова.
 */
export default function memoizeRequest<T>(request: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = request().catch((error) => {
        promise = null; // Сбрасываем при ошибке
        throw error;
      });
    }
    return promise;
  };
}
