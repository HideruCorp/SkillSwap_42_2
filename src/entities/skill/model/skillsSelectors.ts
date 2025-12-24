import type { RootState } from '@app/store'
import type { Skill } from './types'
import { createSelector } from '@reduxjs/toolkit'

// Base selector - extracts skills array from state
const selectSkillsState = (state: RootState) => state.skills.items

/**
 * Memoized selector that returns all skills.
 * Returns the same reference unless skills array changes.
 *
 * Note: Now that likesReceived is stored in a separate favorites slice,
 * this selector provides a stable reference - likes changes don't affect skills array.
 */
export const selectAllSkillsMemoized = createSelector(
  [selectSkillsState],
  (skills): Skill[] => skills,
)

export default selectAllSkillsMemoized
