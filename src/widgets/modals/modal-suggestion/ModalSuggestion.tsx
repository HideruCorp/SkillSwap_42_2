import Button from '@shared/ui/button/Button';
import styles from './ModalSuggestion.module.scss';
import editIcon from '../../../shared/assets/img/edit.svg';
import SkillGallery from '../../skillGallery/SkillGallery';

interface ModalSuggestionProps {
  title: string;
  categories: string;
  subcategories: string;
  description: string;
  images: string[];
  onEdit: () => void;
  onDone: () => void;
}

function ModalSuggestion({
  title,
  categories,
  subcategories,
  description,
  images,
  onEdit,
  onDone,
}: ModalSuggestionProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ваше предложение</h2>
      <p className={styles.subTitle}>Пожалуйста, проверьте и подтвердите правильность данных</p>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div>
            <h1 className={styles.scilTitle}>{title}</h1>
            <p className={styles.categories}>
              {categories} / {subcategories}
            </p>
          </div>
          <p className={styles.description}>{description}</p>
          <div className={styles.buttons}>
            <Button
              className={styles.button}
              type="tertiary"
              onClick={onEdit}
              title="Редактировать"
              iconRight={
                <img
                  src={editIcon}
                  alt="edit"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'inline-block',
                  }}
                />
              }
            />
            <Button className={styles.button} type="primary" onClick={onDone} title="Готово" />
          </div>
        </div>
        <SkillGallery images={images} />
      </div>
    </div>
  );
}

export default ModalSuggestion;
