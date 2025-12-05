import styles from './profile-page.module.scss';

/**
 * ProfilePage - страница "Личные данные" в профиле пользователя
 * Реализует вкладку "Личные данные" в разделе профиля
 *
 * Роут: /profile
 *
 * className={styles['profile__some-bem--specific']}
 */

function ProfilePage() {
  return (
    <section className={styles.profile}>
      <h1>Личные данные</h1>
      <p>Страница личных данных пользователя</p>
    </section>
  );
}

export default ProfilePage;
