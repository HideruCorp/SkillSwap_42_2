import { ru } from 'date-fns/locale';
import type { FormatRelativeToken, Locale } from 'date-fns';

/**
 * Кастомная русская локаль для date-fns с сокращёнными относительными датами
 */
export const customRu: Locale = {
  ...ru,
  formatRelative: (token: FormatRelativeToken) => {
    const map = {
      lastWeek: 'на прош. неделе',
      yesterday: 'вчера',
      today: 'сегодня',
      tomorrow: 'завтра',
      nextWeek: 'на след. неделе',
      other: 'P',
    };
    return map[token];
  },
};
