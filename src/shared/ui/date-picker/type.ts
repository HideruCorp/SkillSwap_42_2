export interface DatePickerProps {
  name?: string;
  /** Выбранная дата */
  value?: Date | undefined;
  /** Callback при изменении даты */
  onChange: (date: Date | undefined) => void;
  /** Placeholder для пустого поля */
  placeholder?: string;
  /** Отключить компонент */
  disabled?: boolean;
  /** Текст ошибки */
  error?: string;
  /** Минимальная дата для выбора */
  minDate?: Date;
  /** Максимальная дата для выбора */
  maxDate?: Date;
}
