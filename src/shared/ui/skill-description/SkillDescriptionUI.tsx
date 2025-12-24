import type { SkillDescriptionUIProps } from './type'
import styles from './skill-description-ui.module.scss'

export function SkillDescriptionUI({
  skillName,
  category,
  subcategory,
  description,
}: SkillDescriptionUIProps) {
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1 className={styles.skillName}>{skillName}</h1>
        <h3 className={styles.category}>
          {category}
          {' '}
          /
          {subcategory}
        </h3>
      </div>
      <h4 className={styles.description}>{description}</h4>
    </div>
  )
}

export default SkillDescriptionUI
