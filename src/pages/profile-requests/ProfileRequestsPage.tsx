import {
  initializeRequests,
  selectAllRequests,
  selectRequestsError,
  selectRequestsLoading,
} from '@entities/request';
import { useRequestsApi } from '@features/requests';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@app/store';
import styles from './profile-requests-page.module.scss';

/**
 * ProfileRequestsPage - страница "Заявки" в профиле пользователя
 * Реализует вкладку "Заявки" в разделе профиля
 *
 * Роут: /profile/requests
 */

function ProfileRequestsPage() {
  const dispatch = useDispatch();
  const { createRequest } = useRequestsApi();
  const requests = useSelector(selectAllRequests);
  const isLoading = useSelector(selectRequestsLoading);
  const error = useSelector(selectRequestsError);

  useEffect(() => {
    dispatch(initializeRequests());
  }, [dispatch]);

  const handleAddTestRequest = () => {
    createRequest({
      requestedSkill: 1,
      fromUser: 2,
      toUser: 0,
    });
  };

  return (
    <section className={styles['profile-requests']}>
      <h1>Заявки</h1>

      {/* Тестовая панель - удалить после проверки */}
      <div style={{ padding: '20px', background: '#f0f0f0', marginBottom: '20px' }}>
        <h3>Тестирование персистентности</h3>
        <button type="button" onClick={handleAddTestRequest} style={{ padding: '10px 20px' }}>
          Добавить тестовую заявку
        </button>
        <p>После добавления перезагрузите страницу - данные должны сохраниться</p>
      </div>

      {isLoading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      <h2>Список заявок ({requests.length})</h2>
      {requests.length === 0 ? (
        <p>Заявок пока нет</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li
              key={req.id}
              style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}
            >
              <div>ID: {req.id}</div>
              <div>Скилл: {req.requestedSkill}</div>
              <div>От пользователя: {req.fromUser}</div>
              <div>Статус: {req.status}</div>
              <div>Создано: {new Date(req.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProfileRequestsPage;
