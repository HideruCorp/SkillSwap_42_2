// Types
import skillsReducer from './model/skillsSlice';

export type { Skill, SkillPreview, CreateSkillDTO } from './model/types';

// Slice
export {
  default as skillsReducer,
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  addFavorite,
  removeFavorite,
  selectAllSkills,
  selectSkillById,
  selectSkillsByUserId,
  selectFavoriteSkillIds,
  selectSkillsLoading,
  selectSkillsError,
} from './model/skillsSlice';

export default skillsReducer;

/* TODO move UI components from shared/widget layers
// Превью скилла на странице скилла и при завершеннии регистрации
export { SkillPreview } from './ui/skill-preview';
*/
