import DeltaStorage from './deltaStorage'

// Utils
export { loadMergedData, loadSkillById, loadStoredUserByEmail, loadUserById } from './dataMerger'

export { initializeAppData, resetAllData } from './initializeApp'
export type { InitResult } from './initializeApp'
// Types
export type { StoredSkill, StoredUser } from './types'
export default DeltaStorage
