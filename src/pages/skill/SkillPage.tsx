import { useParams } from 'react-router-dom';
import styles from './skill-page.module.scss';

/*
className={styles['skill__some-bem--specific']}
*/

function SkillPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className={styles.skill}>
      <h1>Страница навыка</h1>
      <p>ID навыка: {id}</p>
    </section>
  );
}

export default SkillPage;
