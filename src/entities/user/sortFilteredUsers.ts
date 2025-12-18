import type { Skill, User } from '@shared/types';
import type { SortOption } from '@features/sort';
import { calculateAge } from '@shared/lib/date';

// Подсчет общего количества лайков пользователя (сумма лайков всех его навыков)
function getUserLikesCount(userId: number, skills: Skill[]): number {
  const userSkills = skills.filter((s) => s.userId === userId);
  // Подсчитываем общее количество лайков всех навыков пользователя
  return userSkills.reduce((total, skill) => {
    // Проверяем наличие likesReceived в skill (может быть в расширенном типе)
    const likes = (skill as any).likesReceived;
    if (Array.isArray(likes)) {
      return total + likes.length;
    }
    return total;
  }, 0);
}

/**
 * Сортирует отфильтрованных пользователей по заданному критерию
 */
export default function sortFilteredUsers(
  users: User[],
  sortBy: SortOption,
  skills: Skill[]
): User[] {
  const sorted = [...users];

  switch (sortBy) {
    case 'popular': {
      // Сортировка по популярности (количество лайков/навыков)
      return sorted.sort((a, b) => {
        const likesA = getUserLikesCount(a.id, skills);
        const likesB = getUserLikesCount(b.id, skills);
        return likesB - likesA; // По убыванию
      });
    }

    case 'newest': {
      // Сортировка по дате регистрации (новые сначала)
      return sorted.sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return dateB - dateA; // По убыванию (новые выше)
      });
    }

    case 'oldest': {
      // Сортировка по дате регистрации (старые сначала)
      return sorted.sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return dateA - dateB; // По возрастанию (старые выше)
      });
    }

    case 'name': {
      // Сортировка по имени (алфавит)
      return sorted.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB, 'ru');
      });
    }

    case 'age': {
      // Сортировка по возрасту (младшие сначала)
      return sorted.sort((a, b) => {
        const ageA = calculateAge(a.dateOfBirth);
        const ageB = calculateAge(b.dateOfBirth);
        return ageA - ageB; // По возрастанию (младшие выше)
      });
    }

    default:
      return sorted;
  }
}
