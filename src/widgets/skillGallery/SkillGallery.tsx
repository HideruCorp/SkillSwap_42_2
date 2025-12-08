import ImageGallery, { type ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ArrowLeft from '@shared/assets/img/arrow-Gallery-Left.svg?react';
import ArrowRight from '@shared/assets/img/arrow-Gallery-Right.svg?react';
import styles from './skill-gallery.module.scss';

interface SkillGalleryProps {
  images: string[];
  title?: string;
}

function SkillGallery({ images, title = 'Изображение' }: SkillGalleryProps) {
  if (!images || images.length === 0) {
    return <div className={styles.placeholder}>Нет изображений</div>;
  }

  const galleryImages = images.map((img) => {
    const src = img.startsWith('http') ? img : `/skills/${img}`;
    return {
      original: src,
      thumbnail: src,
      originalAlt: title,
      thumbnailAlt: title,
    };
  });

  const totalImages = images.length;
  const visibleThumbnails = 3;
  const remainingCount = totalImages > visibleThumbnails ? totalImages - visibleThumbnails : 0;

  const renderThumbInner = (item: ReactImageGalleryItem) => {
    const index = galleryImages.findIndex((img) => img.thumbnail === item.thumbnail);
    const isLastVisible = index === visibleThumbnails - 1;

    return (
      <div className={styles.thumbnailWrapper}>
        <img src={item.thumbnail} alt={item.thumbnailAlt} />
        {isLastVisible && remainingCount > 0 && (
          <div className={styles.overlay}>+{remainingCount}</div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.skillGallery}>
      <ImageGallery
        items={galleryImages}
        renderThumbInner={renderThumbInner}
        renderLeftNav={(onClick) => (
          <button type="button" onClick={onClick} className={styles.leftArrow}>
            <ArrowLeft />
          </button>
        )}
        renderRightNav={(onClick) => (
          <button type="button" onClick={onClick} className={styles.rightArrow}>
            <ArrowRight />
          </button>
        )}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="right"
        showNav
        showBullets={false}
      />
    </div>
  );
}

SkillGallery.defaultProps = {
  title: 'Изображение',
};

export default SkillGallery;
