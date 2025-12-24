import type { Category, Subcategory } from '@shared/types'
import styles from './all-skills-modal.module.scss'

interface AllSkillModalProps {
  categories: Category[]
  subcategories: Subcategory[]
}

function AllSkillsModal({ categories, subcategories }: AllSkillModalProps) {
  const getIconUrl = (iconName: string): string => {
    try {
      const iconPath = `/src/shared/assets/img/${iconName}.svg`
      return new URL(iconPath, import.meta.url).href
    } catch (error) {
      console.warn(`Иконка не найдена: ${iconName}`, error)
      return ''
    }
  }

  return (
    <div className={styles.container}>
      {categories.map((category) => {
        const iconUrl = getIconUrl(category.icon)

        return (
          <section key={category.id} className={styles.section}>
            <div className={styles.wrapper}>
              <div className={styles.icon} style={{ backgroundColor: category.color }}>
                {iconUrl
                  ? (
                      <img
                        src={iconUrl}
                        alt={`Иконка ${category.name}`}
                        width={24}
                        height={24}
                        onError={(e) => {
                          // Fallback при ошибке загрузки
                          e.currentTarget.style.display = 'none'
                          const fallback = document.createElement('span')
                          fallback.textContent = category.name.charAt(0)
                          fallback.style.cssText = `
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                      `
                          e.currentTarget.parentElement?.appendChild(fallback)
                        }}
                      />
                    )
                  : (
                      <span className={styles.fallbackIcon}>{category.name.charAt(0)}</span>
                    )}
              </div>

              <div className={styles.content}>
                <h2 className={styles.title}>{category.name}</h2>

                <ul className={styles.list}>
                  {subcategories
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => (
                      <li key={item.id} className={styles.item}>
                        {item.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default AllSkillsModal
