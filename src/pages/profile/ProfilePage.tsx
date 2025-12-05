import styles from './profile-page.module.scss';

/*
className={styles['profile__some-bem--specific']}
*/

function ProfilePage() {
  return (
    <section className={styles.profile}>
      <h1>Личный кабинет</h1>
      <p>Страница профиля пользователя</p>
    </section>
  );
}

export default ProfilePage;
