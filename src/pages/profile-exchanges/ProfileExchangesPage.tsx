import {
  initializeExchanges,
  selectAllExchanges,
  selectExchangesError,
  selectExchangesLoading,
} from '@entities/exchange';
import { useExchangesApi } from '@features/exchanges';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@app/store';
import styles from './profile-exchanges-page.module.scss';

/**
 * ProfileExchangesPage - страница "Мои обмены" в профиле пользователя
 * Реализует вкладку "Мои обмены" в разделе профиля
 *
 * Роут: /profile/exchanges
 */

function ProfileExchangesPage() {
  const dispatch = useDispatch();
  const { createExchange } = useExchangesApi();
  const exchanges = useSelector(selectAllExchanges);
  const isLoading = useSelector(selectExchangesLoading);
  const error = useSelector(selectExchangesError);

  useEffect(() => {
    dispatch(initializeExchanges());
  }, [dispatch]);

  const handleAddTestExchange = () => {
    createExchange({
      requestId: Date.now() - 1000,
      skills: [1, 2],
    });
  };

  const handleAddCompletedExchange = () => {
    createExchange({
      requestId: Date.now() - 1000,
      skills: [3, 4],
      status: 'completed',
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inProgress':
        return '🔄 В процессе';
      case 'completed':
        return '✅ Завершён';
      case 'cancelled':
        return '❌ Отменён';
      default:
        return status;
    }
  };

  return (
    <section className={styles['profile-exchanges']}>
      <h1>Мои обмены</h1>

      {/* Тестовая панель - удалить после проверки */}
      <div style={{ padding: '20px', background: '#f0f0f0', marginBottom: '20px' }}>
        <h3>Тестирование персистентности</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button type="button" onClick={handleAddTestExchange} style={{ padding: '10px 20px' }}>
            Добавить активный обмен
          </button>
          <button
            type="button"
            onClick={handleAddCompletedExchange}
            style={{ padding: '10px 20px' }}
          >
            Добавить завершённый обмен
          </button>
        </div>
        <p>После добавления перезагрузите страницу - данные должны сохраниться</p>
      </div>

      {isLoading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      <h2>Список обменов ({exchanges.length})</h2>
      {exchanges.length === 0 ? (
        <p>Обменов пока нет</p>
      ) : (
        <ul>
          {exchanges.map((exchange) => (
            <li
              key={exchange.id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                background: exchange.status === 'completed' ? '#e8f5e9' : '#fff',
              }}
            >
              <div>ID: {exchange.id}</div>
              <div>Request ID: {exchange.requestId}</div>
              <div>Скиллы: [{exchange.skills.join(', ')}]</div>
              <div>Статус: {getStatusLabel(exchange.status)}</div>
              <div>Создан: {new Date(exchange.createdAt).toLocaleString()}</div>
              {exchange.completedAt && (
                <div>Завершён: {new Date(exchange.completedAt).toLocaleString()}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProfileExchangesPage;
