import editIcon from '../../assets/img/edit.svg';
import './textarea.scss';

interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({ value, onChange }: TextareaProps) {
  return (
    <div className="textarea__wrapper">
      <textarea className="textarea__input" value={value} onChange={onChange} />
      <img className="textarea__icon" src={editIcon} alt="edit" />
    </div>
  );
}
