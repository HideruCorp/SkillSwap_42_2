import styles from './profile-exchanges-page.module.scss';

/**
 * ProfileExchangesPage - страница "Мои обмены" в профиле пользователя
 * Реализует вкладку "Мои обмены" в разделе профиля
 *
 * Роут: /profile/exchanges
 *
 * className={styles['profile-exchanges__some-bem--specific']}
 */

function ProfileExchangesPage() {
  return (
    <section className={styles['profile-exchanges']}>
      <h1>Мои обмены</h1>
      <p>Страница обменов пользователя</p>
    </section>
  );
}

export default ProfileExchangesPage;
