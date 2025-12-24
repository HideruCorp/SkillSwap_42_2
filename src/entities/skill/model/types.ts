import type { Skill, SkillId, SubcategoryId } from '@shared/types'

export type { Skill }

export interface SkillPreview {
  id: SkillId
  title: string
  images: string[]
}

export interface CreateSkillDTO {
  subcategoryId: SubcategoryId
  title: string
  description: string
  images: string[]
}
