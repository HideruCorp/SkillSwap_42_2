import styles from './profile-requests-page.module.scss';

/**
 * ProfileRequestsPage - страница "Заявки" в профиле пользователя
 * Реализует вкладку "Заявки" в разделе профиля
 *
 * Роут: /profile/requests
 *
 * className={styles['profile-requests__some-bem--specific']}
 */

function ProfileRequestsPage() {
  return (
    <section className={styles['profile-requests']}>
      <h1>Заявки</h1>
      <p>Страница заявок пользователя</p>
    </section>
  );
}

export default ProfileRequestsPage;
