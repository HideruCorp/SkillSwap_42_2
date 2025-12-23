import type { Skill } from '@shared/types';

export type SkillSortMode = 'likes' | 'created' | 'all';

/**
 * Sorts skills by the specified mode
 * @param skills - Array of skills to sort
 * @param mode - Sorting mode: 'likes' (by popularity), 'created' (by date), 'all' (no sorting)
 * @param likesMap - Map of skillId to likes count (default: empty object)
 * @returns Sorted array of skills
 */
export default function sortSkills(
  skills: Skill[],
  mode: SkillSortMode,
  likesMap: Record<number, number> = {}
): Skill[] {
  if (mode === 'all') {
    return skills; // No sorting for 'all' mode
  }

  const sorted = [...skills];

  switch (mode) {
    case 'likes': {
      // Sort by popularity (number of likes received) - descending
      return sorted.sort((a, b) => {
        const likesA = likesMap[a.id] || 0;
        const likesB = likesMap[b.id] || 0;
        return likesB - likesA; // Most liked first
      });
    }

    case 'created': {
      // Sort by creation date - newest first
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });
    }

    default:
      return sorted;
  }
}
