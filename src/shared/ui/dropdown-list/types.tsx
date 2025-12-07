export type OptionType = {
  title: string; // это отбражается в dropdown
  value: string; // это записывается в selected
};

export type SelectProps = {
  selected: OptionType[]; // отсюда записывать результат выбора для дальнейшего сабмита
  options: OptionType[]; // лист с вариантами выбора для dropdown
  placeholder: string; // плейсхолдер, пишется пока не сделан выбор
  title: string; // Заголовок dropdown
  type: 'list' | 'сheckbox' | 'input'; // list - обычный dropdown, сheckbox - dropdown с чекбоксами, input - dropdown с инпутом и фильтром
  onChange: (selected: OptionType[]) => void; // изменения выбора
};
