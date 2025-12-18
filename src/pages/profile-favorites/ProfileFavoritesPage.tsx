import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '@app/store';
import { selectAllUsers } from '@entities/user/model/usersSlice';
import { useFavorites } from '@features/favorites';
import UsersSection from '@widgets/users-section/UsersSection';
import Button from '@shared/ui/button/Button';
import styles from './profile-favorites-page.module.scss';

function ProfileFavoritesPage() {
  const navigate = useNavigate();
  const allUsers = useSelector(selectAllUsers);

  // TODO: Реализовать корректный хук useFavorites на основе skillsSlice
  // Временная заглушка - пустые обработчики
  const { favoriteUserIds } = useFavorites();

  // TODO: Переделать на работу с навыками (skills), а не пользователями
  // Временная реализация для отображения пользователей
  const favoriteUsers = useMemo(
    () => {
      // TODO: Заменить на фильтрацию навыков
      // Сейчас фильтруем пользователей по временному механизму лайков
      return allUsers.filter((user) => favoriteUserIds.includes(user.id));
    },
    [allUsers, favoriteUserIds]
  );

  const hasFavorites = favoriteUsers.length > 0;

  const handleGoToSkills = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {!hasFavorites ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>♡</div>
          <h3 className={styles.emptyTitle}>Пока пусто</h3>
          <p className={styles.emptyText}>
            Нажмите на сердечко в карточке пользователя, чтобы добавить его в избранное
          </p>
          <Button
            onClick={handleGoToSkills}
            type="primary"
            className={styles.goToSkillsButton}
          >
            Вперёд за навыками
          </Button>
        </div>
      ) : (
        <UsersSection
          title="Избранное"
          mode="all"
          filteredUserIds={favoriteUserIds}
          infinite={false}
          showAllButton={false}
          showCount={false}
          showSortButton={false}
        />
      )}
    </div>
  );
}

export default ProfileFavoritesPage;