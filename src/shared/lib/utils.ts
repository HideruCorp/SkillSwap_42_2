/**
 * Генерирует уникальный числовой ID на основе timestamp и случайного числа
 * @returns Уникальный числовой идентификатор
 */
export default function generateNumericId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
