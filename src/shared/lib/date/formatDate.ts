import { differenceInCalendarDays, differenceInYears, format, formatRelative } from 'date-fns';
import { customRu } from './locale';

/**
 * Форматирует дату относительно текущего дня
 * - Менее 3 дней назад: "сегодня", "вчера", "на прош. неделе"
 * - Более 3 дней: "5 янв", "12 мар"
 * - В прошлом и более году: "5 янв 2024", "12 мар 1975"
 */
function formatRelativeDate(date: Date): string {
  const today = new Date();
  const diffDays = differenceInCalendarDays(today, date);

  if (diffDays < 3) {
    return formatRelative(date, today, { locale: customRu });
  }
  if (today.getFullYear() !== date.getFullYear()) {
    return format(date, 'd MMM yyyy', { locale: customRu });
  }

  return format(date, 'd MMM', { locale: customRu });
}

const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  return differenceInYears(now, dob);
};

// Helper function to get correct plural form for days
const getDaysLabel = (days: number): string => {
  if (days % 10 === 1 && days % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
  return 'дней';
};

const getAgeSuffix = (years: number): string => {
  if (years % 10 === 1 && years % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года';
  return 'лет';
};

export { formatRelativeDate, calculateAge, getDaysLabel, getAgeSuffix };
export default formatRelativeDate;
