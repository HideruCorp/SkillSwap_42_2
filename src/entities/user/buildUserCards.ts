import type {
  RawUser,
  RawSkill,
  RawCity,
  RawCategoriesJson,
} from '@features/infinite-scroll/types';
import type { UserCardProps } from '@shared/ui/user-card/types';
import { calculateAge } from '@shared/helpers';
import { getCategoryColorBySubcategoryId } from '@shared/helpers';

function getCityName(cityId: number | undefined, cities: RawCity[]): string {
  if (!cityId) return 'Город не указан';
  const found = cities.find((c) => c.id === cityId);
  return found?.name ?? 'Город не указан';
}

export default function buildUserCards(
  rawUsers: RawUser[],
  rawSkills: RawSkill[],
  rawCities: RawCity[],
  rawCategories: RawCategoriesJson
): UserCardProps[] {
  const { categories, subcategories } = rawCategories;

  return rawUsers.map((u) => {
    const id = typeof u.id === 'number' ? u.id : Number(u.id);
    // навыки по идентификатору пользователя
    const userSkills = rawSkills.filter((s) => s.userId === id);
    const canTeach = userSkills.map((s) => ({
      id: String(s.id),
      text: s.title,
      bgColor: getCategoryColorBySubcategoryId(s.subcategoryId ?? 0, categories, subcategories),
    }));

    // wantsToLearn: user.skillInterests — это идентификаторы подкатегорий
    const wantsToLearn =
      Array.isArray(u.skillInterests) && u.skillInterests.length > 0
        ? u.skillInterests
            .map((sid) => {
              // найти название подкатегории
              const sub = subcategories.find((sc: { id: number }) => sc.id === sid);
              if (!sub) return null;
              return {
                id: String(sid),
                text: sub.name,
                bgColor: getCategoryColorBySubcategoryId(sid, categories, subcategories),
              };
            })
            .filter((t): t is { id: string; text: string; bgColor: string } => t !== null)
        : [];

    return {
      id,
      mainSkillId: userSkills[0]?.id ?? 0,
      name: u.name ?? 'Без имени',
      city: getCityName(u.cityId, rawCities),
      age: calculateAge(u.dateOfBirth ?? ''),
      canTeach,
      wantsToLearn,
      avatarUrl: u.avatarUrl ?? null,
      likes: userSkills[0]?.likesReceived ?? []
    } as UserCardProps;
  });
}
