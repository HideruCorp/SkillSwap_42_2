export interface OptionType {
  title: string // это отбражается в dropdown
  value: string // это записывается в selected
}

export interface SelectProps {
  selected: OptionType[] // отсюда записывать результат выбора для дальнейшего сабмита
  options: OptionType[] // лист с вариантами выбора для dropdown
  placeholder: string // плейсхолдер, пишется пока не сделан выбор
  title: string // Заголовок dropdown
  type: 'list' | 'сheckbox' | 'input' // list - обычный dropdown, сheckbox - dropdown с чекбоксами, input - dropdown с инпутом и фильтром
  onChange: (selected: OptionType[]) => void // изменения выбора
  disabled?: boolean // дизейбл (не открывать, не выбирать)
  groupId?: string // чтобы закрывать только "соседние" дропдауны внутри одной формы
}
