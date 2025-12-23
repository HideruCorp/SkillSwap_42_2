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

// Функция для транслитерации русского текста в английский
const transliterateToEnglish = (text: string): string => {
  if (!text) return '';

  const translitMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'Yo',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'Kh',
    Ц: 'Ts',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Shch',
    Ъ: '',
    Ы: 'Y',
    Ь: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
  };

  return text
    .split('')
    .map((char) => translitMap[char] || char)
    .join('');
};

// Функция для транслитерации английского текста в русский
const transliterateToRussian = (text: string): string => {
  if (!text) return '';

  const translitMap: Record<string, string> = {
    shch: 'щ',
    yo: 'ё',
    zh: 'ж',
    kh: 'х',
    ts: 'ц',
    ch: 'ч',
    sh: 'ш',
    yu: 'ю',
    ya: 'я',
    a: 'а',
    b: 'б',
    v: 'в',
    g: 'г',
    d: 'д',
    e: 'е',
    z: 'з',
    i: 'и',
    y: 'й',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    f: 'ф',
    h: 'х',
    c: 'ц',
    Shch: 'Щ',
    Yo: 'Ё',
    Zh: 'Ж',
    Kh: 'Х',
    Ts: 'Ц',
    Ch: 'Ч',
    Sh: 'Ш',
    Yu: 'Ю',
    Ya: 'Я',
    A: 'А',
    B: 'Б',
    V: 'В',
    G: 'Г',
    D: 'Д',
    E: 'Е',
    Z: 'З',
    I: 'И',
    Y: 'Й',
    K: 'К',
    L: 'Л',
    M: 'М',
    N: 'Н',
    O: 'О',
    P: 'П',
    R: 'Р',
    S: 'С',
    T: 'Т',
    U: 'У',
    F: 'Ф',
    H: 'Х',
    C: 'Ц',
  };

  let result = text;
  Object.entries(translitMap)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([eng, rus]) => {
      result = result.replace(new RegExp(eng, 'gi'), rus);
    });

  return result;
};

// Функция для нормализации текста для поиска
const normalizeForSearch = (text: string): string[] => {
  if (!text) return [];

  const lowerText = text.toLowerCase();

  return [lowerText, transliterateToEnglish(lowerText), transliterateToRussian(lowerText)].filter(
    (variant, index, array) => variant && array.indexOf(variant) === index
  );
};

// Функция проверки совпадения с учетом транслитерации
const matchesWithTransliteration = (text: string, searchTerm: string): boolean => {
  if (!text || !searchTerm) return false;

  const searchVariants = normalizeForSearch(searchTerm);
  const textVariants = normalizeForSearch(text);

  for (const searchVariant of searchVariants) {
    for (const textVariant of textVariants) {
      if (textVariant.includes(searchVariant)) {
        return true;
      }
    }
  }

  return false;
};

export default function filterUsers(
  users: User[],
  filters: FilterParams,
  skills: Skill[],
  cities: City[],
  categories?: CategoriesResponse
): User[] {
  return users.filter((user) => {
    // 1. Фильтр по полу
    if (filters.gender !== 'all' && user.gender !== filters.gender) {
      return false;
    }

    // 2. Фильтр по городам
    if (filters.cities.length > 0) {
      const userCity = cities.find((c) => c.id === user.cityId);
      if (!userCity || !filters.cities.includes(userCity.name)) {
        return false;
      }
    }

    // 3. Текстовый поиск
    if (filters.textSearch && filters.textSearch.trim() !== '') {
      const searchTerm = filters.textSearch.trim();

      // Поиск по имени пользователя (всегда работает)
      const userName = user.name || '';
      const userFullName = user.fullName || '';

      const matchesName =
        matchesWithTransliteration(userName, searchTerm) ||
        matchesWithTransliteration(userFullName, searchTerm);

      // Получаем навыки пользователя
      const userSkills = skills.filter((s) => s.userId === user.id);

      // Разделение логики по фильтру хочу/могу:

      // А. "Может научить" - ищем по названиям навыков (skill.title/name)
      if (filters.skillType === 'teach') {
        const matchesSkillTitle = userSkills.some((skill) => {
          const skillTitle = skill.title || skill.name || '';
          return matchesWithTransliteration(skillTitle, searchTerm);
        });

        // Для "Может научить" проверяем только имя и названия навыков
        if (!matchesName && !matchesSkillTitle) {
          return false;
        }
      }

      // Б. "Хочу научиться" - ищем по названиям подкатегорий интересов
      else if (filters.skillType === 'learn') {
        let matchesSubcategory = false;

        if (categories?.subcategories && user.skillInterests) {
          // Ищем только среди интересов пользователя
          matchesSubcategory = user.skillInterests.some((interestId) => {
            const subcategory = categories.subcategories.find((sub) => sub.id === interestId);
            return subcategory && matchesWithTransliteration(subcategory.name, searchTerm);
          });
        }

        // Для "Хочу научиться" проверяем имя и названия подкатегорий интересов
        if (!matchesName && !matchesSubcategory) {
          return false;
        }
      }

      // В. "Все" - ищем везде (по навыкам и подкатегориям)
      else {
        // Поиск по названиям навыков
        const matchesSkillTitle = userSkills.some((skill) => {
          const skillTitle = skill.title || skill.name || '';
          return matchesWithTransliteration(skillTitle, searchTerm);
        });

        // Поиск по названиям подкатегорий (и навыков, и интересов)
        let matchesSubcategory = false;
        if (categories?.subcategories) {
          const userSkillSubcategoryIds = userSkills
            .map((s) => s.subcategoryId)
            .filter((id): id is number => id != null && typeof id === 'number');

          const userInterestIds = user.skillInterests || [];
          const allUserSubcategoryIds = [
            ...new Set([...userSkillSubcategoryIds, ...userInterestIds]),
          ];

          matchesSubcategory = categories.subcategories
            .filter((sub) => allUserSubcategoryIds.includes(sub.id))
            .some((sub) => matchesWithTransliteration(sub.name, searchTerm));
        }

        // Для "все" проверяем имя, навыки И подкатегории
        if (!matchesName && !matchesSkillTitle && !matchesSubcategory) {
          return false;
        }
      }
    }

    // 4. Фильтр по типу навыка (проверка наличия навыков/интересов)
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

    // 5. Фильтр по подкатегориям
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
