import { useMemo } from 'react';
import { useSelector } from '@app/store';
import { useFavorites } from '@features/favorites';
import { selectAllSkills } from '@entities/skill/model/skillsSlice';
import styles from './profile-favorites-page.module.scss';

function ProfileFavoritesPage() {
  const allSkills = useSelector(selectAllSkills);
  const { favoriteSkillIds } = useFavorites();

  const favoriteSkills = useMemo(
    () => allSkills.filter((skill) => favoriteSkillIds.includes(skill.id)),
    [allSkills, favoriteSkillIds]
  );

  return (
    <section className={styles['profile-favorites']}>
      <h1>Избранное</h1>
      {favoriteSkills.length === 0 ? (
        <p>У вас пока нет избранных навыков.</p>
      ) : (
        <ul>
          {favoriteSkills.map((skill) => (
            <li key={skill.id}>
              <strong>{skill.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProfileFavoritesPage;
