import type {
  User,
  Skill,
  City,
  CategoriesResponse,
  Subcategory,
  TSkillType,
  Gender,
  SubcategoryId,
} from '@shared/types';

export interface FilterParams {
  skillType: TSkillType;
  gender: Gender;
  cities: string[];
  subcategories: number[];
  textSearch: string;
}

export default function filterUsers(
  users: User[],
  filters: FilterParams,
  skills: Skill[],
  cities: City[],
  categories?: CategoriesResponse
): User[] {
  return users.filter((user) => {
    if (filters.gender !== 'all' && user.gender !== filters.gender) {
      return false;
    }

    if (filters.cities.length > 0) {
      const userCity = cities.find((c) => c.id === user.cityId);
      if (!userCity || !filters.cities.includes(userCity.name)) {
        return false;
      }
    }

    if (filters.textSearch && filters.textSearch.trim() !== '') {
      const searchLower = filters.textSearch.toLowerCase().trim();
      const userNameLower = (user.name || '').toLowerCase();
      if (!userNameLower.includes(searchLower)) {
        return false;
      }
    }

    if (filters.skillType !== 'all') {
      const userTeachSkills = skills
        .filter((s) => s.userId === user.id)
        .map((s) => s.subcategoryId)
        .filter((id): id is number => id != null && typeof id === 'number');

      const userLearnSkills = user.skillInterests || [];

      if (filters.skillType === 'teach') {
        if (filters.subcategories.length > 0) {
          const hasMatchingTeachSkill = filters.subcategories.some((subcategoryId) =>
            userTeachSkills.includes(subcategoryId)
          );

          if (!hasMatchingTeachSkill) {
            return false;
          }
        } else if (userTeachSkills.length === 0) {
          return false;
        }
      } else if (filters.skillType === 'learn') {
        if (filters.subcategories.length > 0) {
          const hasMatchingLearnSkill = filters.subcategories.some((subcategoryId) =>
            userLearnSkills.includes(subcategoryId)
          );

          if (!hasMatchingLearnSkill) {
            return false;
          }
        } else if (userLearnSkills.length === 0) {
          return false;
        }
      }
    }

    if (filters.subcategories && filters.subcategories.length > 0) {
      const userSkills = skills.filter((s) => s && s.userId === user.id);
      const userSkillSubcategories = userSkills
        .map((s) => s.subcategoryId)
        .filter((id): id is number => id != null && typeof id === 'number');
      const userInterestsSubcategories = user.skillInterests || [];

      const expandedSubcategories = new Set<number>();

      filters.subcategories.forEach((id) => {
        if (categories && categories.categories && categories.subcategories) {
          const isCategory = categories.categories.some((cat: any) => cat && cat.id === id);
          if (isCategory) {
            const categorySubcategories = categories.subcategories
              .filter((sub: Subcategory) => sub && sub.categoryId === id)
              .map((sub: Subcategory) => sub.id)
              .filter((subId: SubcategoryId): subId is number => typeof subId === 'number');
            categorySubcategories.forEach((subId: number) => expandedSubcategories.add(subId));
          } else {
            expandedSubcategories.add(id);
          }
        } else {
          expandedSubcategories.add(id);
        }
      });

      const hasMatchingSubcategory = Array.from(expandedSubcategories).some(
        (subId) =>
          userSkillSubcategories.includes(subId) || userInterestsSubcategories.includes(subId)
      );

      if (!hasMatchingSubcategory) {
        return false;
      }
    }

    return true;
  });
}
