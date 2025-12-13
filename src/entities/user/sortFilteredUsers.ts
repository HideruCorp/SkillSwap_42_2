import type { User } from '@shared/types';
import type { RawSkill } from '@features/infinite-scroll/types';
import type { SortOption } from '../../services/slices/sortSlice/sortSlice';

// Вспомогательная функция для вычисления возраста
function calcAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

// Подсчет общего количества лайков пользователя (сумма лайков всех его навыков)
function getUserLikesCount(userId: number, skills: RawSkill[]): number {
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
  skills: RawSkill[]
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
        const ageA = calcAge(a.dateOfBirth);
        const ageB = calcAge(b.dateOfBirth);
        return ageA - ageB; // По возрастанию (младшие выше)
      });
    }

    default:
      return sorted;
  }
}

