import DeltaStorage from './deltaStorage';

// Types
export type { StoredUser, StoredSkill } from './types';

// Utils
export { loadMergedData, loadUserById, loadSkillById, loadStoredUserByEmail } from './dataMerger';
export { initializeAppData, resetAllData } from './initializeApp';
export type { InitResult } from './initializeApp';
export default DeltaStorage;
