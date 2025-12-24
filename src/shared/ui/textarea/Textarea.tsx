import editIcon from '../../assets/img/edit.svg'
import './textarea.scss'

interface TextareaProps {
  value?: string
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
}

export default function Textarea({ value, placeholder, onChange, className }: TextareaProps) {
  return (
    <div className={`textarea__wrapper ${className}`}>
      <textarea
        className="textarea__input"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <img className="textarea__icon" src={editIcon} alt="edit" />
    </div>
  )
}
