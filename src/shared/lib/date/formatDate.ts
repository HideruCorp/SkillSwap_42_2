import { differenceInCalendarDays, format, formatRelative } from 'date-fns';
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

export { formatRelativeDate };
export default formatRelativeDate;
