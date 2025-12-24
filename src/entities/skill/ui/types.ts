import type { SkillTag } from '@shared/ui/skill-tag-list'
import type { ReactNode } from 'react'

export interface SkillCardProps {
  id: number // SkillId from canTeach
  userId: number // skill.userId
  name: string
  city: string
  age: number
  canTeach: SkillTag
  wantsToLearn: SkillTag[]
  avatarUrl?: string | null
  onDetailsClick?: (id: number) => void // принимает id скилла
  actionSlot?: ReactNode // слот для кнопки лайка
}
