import type { Skill, SubcategoryId } from '@shared/types';
import sortSkills from './sortSkills';

/**
 * Возвращает навыки с интересами пользователя в первую очередь, затем остальные
 * Все отсортированы по дате создания в пределах своих групп
 *
 * @param skills - Все доступные навыки
 * @param userInterests - Массив ID подкатегорий, в которых пользователь заинтересован
 * @param likesMap - Map of skillId to likes count (для сортировки)
 * @returns Навыки, отсортированные с соответствующими интересами в первую очередь, затем остальные (все по дате)
 */
export default function recommendSkills(
  skills: Skill[],
  userInterests: SubcategoryId[] | undefined,
  likesMap: Record<number, number> = {}
): Skill[] {
  // Если интересов нет, вернуть все навыки, отсортированные по дате создания
  if (!userInterests || userInterests.length === 0) {
    return sortSkills(skills, 'created', likesMap);
  }

  // Разделить навыки на соответствующие и несоответствующие
  const matching: Skill[] = [];
  const nonMatching: Skill[] = [];

  skills.forEach((skill) => {
    if (userInterests.includes(skill.subcategoryId)) {
      matching.push(skill);
    } else {
      nonMatching.push(skill);
    }
  });

  // Отсортировать обе группы по дате создания (новые первыми)
  const sortedMatching = sortSkills(matching, 'created', likesMap);
  const sortedNonMatching = sortSkills(nonMatching, 'created', likesMap);

  // Вернуть соответствующие навыки первыми, затем несоответствующие
  return [...sortedMatching, ...sortedNonMatching];
}
