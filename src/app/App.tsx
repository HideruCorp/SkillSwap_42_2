import './App.scss';
import Layout from '@widgets/layout';
import { useEffect, useState } from 'react';
import DeltaStorage from '@shared/lib/storage';
import { initializeUsers } from '@entities/user/model/usersSlice';
import { initializeSkills } from '@entities/skill/model/skillsSlice';
import { bootstrapAuth } from '@features/auth';
import AppRouter from './router';
import { useDispatch } from '../services/store';

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Сначала инициализируем IndexedDB
        await DeltaStorage.init();

        // Затем загружаем данные в Redux
        await Promise.all([dispatch(initializeUsers()), dispatch(initializeSkills())]);

        // Bootstrap auth после загрузки users (для проверки существования пользователя)
        await dispatch(bootstrapAuth());

        setIsInitialized(true);
      } catch (err) {
        console.error('Ошибка инициализации приложения:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setIsInitialized(true); // Разрешаем рендер даже при ошибке
      }
    };

    init();
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    console.error('Ошибка приложения:', error);
  }

  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
}

export default App;
