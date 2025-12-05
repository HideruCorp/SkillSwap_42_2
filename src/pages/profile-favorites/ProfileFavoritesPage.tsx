import styles from './profile-favorites-page.module.scss';

/*
className={styles['profile-favorites__some-bem--specific']}
*/

function ProfileFavoritesPage() {
  return (
    <section className={styles['profile-favorites']}>
      <h1>Избранное</h1>
      <p>Страница избранных навыков</p>
    </section>
  );
}

export default ProfileFavoritesPage;
