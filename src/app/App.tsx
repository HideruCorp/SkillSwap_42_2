import './App.scss';
import Layout from '@widgets/layout';
import { useEffect, useState } from 'react';
import DeltaStorage from '@shared/lib/storage';
import { initializeUsers } from '@entities/user/model/usersSlice';
import { initializeSkills } from '@entities/skill/model/skillsSlice';
import AppRouter from './router';
import { useDispatch } from '../services/store';

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Сначала инициализируем IndexedDB
      await DeltaStorage.init();

      // Затем загружаем данные в Redux
      await Promise.all([dispatch(initializeUsers()), dispatch(initializeSkills())]);

      setIsInitialized(true);
    };

    init();
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Загрузка...</div>;
  }

  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
}

export default App;
