export type SectionHeaderProps = {
  title: string;
  onAction?: () => void;
  actionLabel?: string; // например "Смотреть все"
  className?: string;
  extraAction?: React.ReactNode; // дополнительный элемент (например, кнопка сортировки)
};
