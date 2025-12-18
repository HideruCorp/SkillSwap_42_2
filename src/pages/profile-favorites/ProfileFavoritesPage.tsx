import { useMemo } from 'react';
import { useSelector } from '@app/store';
import { selectAllUsers } from '@entities/user/model/usersSlice';
import { useFavorites } from '@features/favorites';
import UsersSection from '@widgets/users-section/UsersSection';
import styles from './profile-favorites-page.module.scss';

function ProfileFavoritesPage() {
  const allUsers = useSelector(selectAllUsers);
  const { favoriteUserIds } = useFavorites();

  const favoriteUsers = useMemo(
    () => allUsers.filter((user) => favoriteUserIds.includes(user.id)),
    [allUsers, favoriteUserIds]
  );

  const hasFavorites = favoriteUsers.length > 0;

  return (
    <div className={styles.container}>
      {!hasFavorites ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>♡</div>
          <h3 className={styles.emptyTitle}>Пока пусто</h3>
          <p className={styles.emptyText}>
            Нажмите на сердечко в карточке пользователя, чтобы добавить его в избранное
          </p>
        </div>
      ) : (
        <UsersSection
          title=""
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