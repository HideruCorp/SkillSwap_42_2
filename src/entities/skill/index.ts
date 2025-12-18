// Types
import skillsReducer from './model/skillsSlice';

export type { Skill, SkillPreview, CreateSkillDTO } from './model/types';
export type { SkillCardProps } from './ui/types';
export type { SkillSortMode } from './utils/sortSkills';

// Slice
export {
  default as skillsReducer,
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  selectAllSkills,
  selectSkillById,
  selectSkillsByUserId,
  selectSkillsLoading,
  selectSkillsError,
} from './model/skillsSlice';

// Memoized Selectors
export { selectAllSkillsMemoized } from './model/skillsSelectors';

export default skillsReducer;

// Utilities
export { default as sortSkills } from './utils/sortSkills';
export { default as recommendSkills } from './utils/recommendSkills';

// UI Components
export { SkillCard, SkillCardContainer } from './ui';
