import type {
  RawUser,
  RawSkill,
  RawCity,
  RawCategoriesJson,
} from '@features/infinite-scroll/types';
import type { UserCardProps } from '@shared/ui/user-card/types';

// помощник: вычислить возраст
function calcAge(d?: string): number {
  if (!d) return 0;
  const dob = new Date(d);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

function getCityName(cityId: number | undefined, cities: RawCity[]): string {
  if (!cityId) return 'Город не указан';
  const found = cities.find((c) => c.id === cityId);
  return found?.name ?? 'Город не указан';
}

// помощник: построить отображение цветов категорий по id подкатегорий
function buildSubcatColorMap(categoriesJson: RawCategoriesJson) {
  const map = new Map<number, string>();
  const cats = categoriesJson?.categories ?? [];
  const subs = categoriesJson?.subcategories ?? [];
  subs.forEach((sub: { categoryId: any; id: number }) => {
    const cat = cats.find((c: { id: any }) => c.id === sub.categoryId);
    if (cat) map.set(sub.id, cat.color);
  });
  return map;
}

export default function buildUserCards(
  rawUsers: RawUser[],
  rawSkills: RawSkill[],
  rawCities: RawCity[],
  rawCategories: RawCategoriesJson
): UserCardProps[] {
  const colorMap = buildSubcatColorMap(rawCategories);

  return rawUsers.map((u) => {
    const id = typeof u.id === 'number' ? u.id : Number(u.id);
    // навыки по идентификатору пользователя
    const userSkills = rawSkills.filter((s) => s.userId === id);
    const canTeach = userSkills.map((s) => ({
      id: String(s.id),
      text: s.title,
      bgColor: colorMap.get(s.subcategoryId ?? 0) ?? '#EEE7F7',
    }));

    // wantsToLearn: user.skillInterests — это идентификаторы подкатегорий
    const wantsToLearn =
      Array.isArray(u.skillInterests) && u.skillInterests.length > 0
        ? u.skillInterests
            .map((sid) => {
              // найти название подкатегории
              const sub = rawCategories.subcategories.find((sc: { id: number }) => sc.id === sid);
              if (!sub) return null;
              return {
                id: String(sid),
                text: sub.name,
                bgColor: colorMap.get(sid) ?? '#EEE7F7',
              };
            })
            .filter((t): t is { id: string; text: string; bgColor: string } => t !== null)
        : [];

    return {
      id,
      name: u.name ?? 'Без имени',
      city: getCityName(u.cityId, rawCities),
      age: calcAge(u.dateOfBirth),
      canTeach,
      wantsToLearn,
      avatarUrl: u.avatarUrl ?? null,
      likes: userSkills[0].likesReceived
    } as UserCardProps;
  });
}
