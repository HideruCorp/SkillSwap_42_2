export interface Option {
  label: string
  value: string
}

export interface RadioGroupProps {
  options: Option[]
  onChange: (value: string) => void
  value: string
  name: string
}
