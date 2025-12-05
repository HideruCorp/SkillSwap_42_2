import styles from './profile-skills-page.module.scss';

/**
 * ProfileSkillsPage - страница "Мои навыки" в профиле пользователя
 * Реализует вкладку "Мои навыки" в разделе профиля
 *
 * Роут: /profile/skills
 *
 * className={styles['profile-skills__some-bem--specific']}
 */

function ProfileSkillsPage() {
  return (
    <section className={styles['profile-skills']}>
      <h1>Мои навыки</h1>
      <p>Страница навыков пользователя</p>
    </section>
  );
}

export default ProfileSkillsPage;
