import styles from './all-skills-modal.module.scss';
import type { Category, Subcategory } from '@shared/types';

interface AllSkillModalProps {
  categories: Category[];
  subcategories: Subcategory[];
}

function AllSkillsModal({ categories, subcategories }: AllSkillModalProps) {
  return categories.map((category) => {
    return (
      <section className={`${styles.section}`}>
        <div className={styles.wrapper}>
          <div className={`${styles.icon}`}>
            <img src={`src/shared/assets/img/${category.icon}.svg`} alt="иконка категории" />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>{category.name}</h2>

            <ul className={styles.list}>
              {subcategories
                .filter((item) => item.categoryId === category.id)
                .map((item) => {
                  return <li className={styles.item}>{item.name}</li>;
                })}
            </ul>
          </div>
        </div>
      </section>
    );
  });
}

export default AllSkillsModal;
