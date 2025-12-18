import type { Skill } from '@shared/types';

export type SkillSortMode = 'likes' | 'created' | 'all';

/**
 * Sorts skills by the specified mode
 * @param skills - Array of skills to sort
 * @param mode - Sorting mode: 'likes' (by popularity), 'created' (by date), 'all' (no sorting)
 * @returns Sorted array of skills
 */
export default function sortSkills(skills: Skill[], mode: SkillSortMode): Skill[] {
  if (mode === 'all') {
    return skills; // No sorting for 'all' mode
  }

  const sorted = [...skills];

  switch (mode) {
    case 'likes': {
      // Sort by popularity (number of likes received) - descending
      return sorted.sort((a, b) => {
        const likesA = a.likesReceived.length;
        const likesB = b.likesReceived.length;
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
