// Types
import skillsReducer from './model/skillsSlice'

// Memoized Selectors
export { selectAllSkillsMemoized } from './model/skillsSelectors'
// Slice
export {
  addSkill,
  deleteSkill,
  selectAllSkills,
  selectSkillById,
  selectSkillsByUserId,
  selectSkillsError,
  selectSkillsLoading,
  setSkills,
  default as skillsReducer,
  updateSkill,
} from './model/skillsSlice'
export type { CreateSkillDTO, Skill, SkillPreview } from './model/types'

// UI Components
export { SkillCard, SkillCardContainer } from './ui'

export type { SkillCardProps } from './ui/types'

export default skillsReducer

export { default as recommendSkills } from './utils/recommendSkills'
export type { SkillSortMode } from './utils/sortSkills'

// Utilities
export { default as sortSkills } from './utils/sortSkills'
