import styles from './SkillLayout.module.scss'

interface SkillLayoutProps {
  children: React.ReactNode
}

function SkillLayout({ children }: SkillLayoutProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default SkillLayout
