import type { Category, Subcategory } from '@shared/types';
import styles from './all-skills-modal.module.scss';

interface AllSkillModalProps {
  categories: Category[];
  subcategories: Subcategory[];
}

function AllSkillsModal({ categories, subcategories }: AllSkillModalProps) {
  return (
    <div className={`${styles.container}`}>
      {categories.map((category) => {
        return (
          <section key={category.id} className={`${styles.section}`}>
            <div className={styles.wrapper}>
              <div className={`${styles.icon}`} style={{ background: category.color }}>
                <img src={`src/shared/assets/img/${category.icon}.svg`} alt="иконка категории" />
              </div>

              <div className={styles.content}>
                <h2 className={styles.title}>{category.name}</h2>

                <ul className={styles.list}>
                  {subcategories
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => {
                      return (
                        <li key={item.id} className={styles.item}>
                          {item.name}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default AllSkillsModal;
