import type { ReactImageGalleryItem } from 'react-image-gallery'
import ArrowLeft from '@shared/assets/img/arrow-Gallery-Left.svg?react'
import ArrowRight from '@shared/assets/img/arrow-Gallery-Right.svg?react'
import ImageGallery from 'react-image-gallery'
import styles from './skill-gallery.module.scss'
import 'react-image-gallery/styles/css/image-gallery.css'

interface SkillGalleryProps {
  images: string[]
  title?: string
}

function SkillGallery({ images, title = 'Изображение' }: SkillGalleryProps) {
  if (!images || images.length === 0) {
    return <div className={styles.placeholder}>Нет изображений</div>
  }

  const galleryImages: ReactImageGalleryItem[] = images.map((img) => {
    const src = img.startsWith('http') || img.startsWith('data:image') ? img : `/skills/${img}`
    return {
      original: src,
      thumbnail: src,
      originalAlt: title,
      thumbnailAlt: title,
    }
  })

  const totalImages = galleryImages.length
  const visibleThumbnails = 3
  const remainingCount = totalImages > visibleThumbnails ? totalImages - visibleThumbnails : 0

  const renderThumbInner = (item: ReactImageGalleryItem) => {
    const index = galleryImages.findIndex((img) => img.thumbnail === item.thumbnail)
    const isLastVisible = index === visibleThumbnails - 1

    return (
      <div className={styles.thumbnailWrapper}>
        <img src={String(item.thumbnail)} alt={String(item.thumbnailAlt ?? '')} />
        {isLastVisible && remainingCount > 0 && (
          <div className={styles.overlay}>
            +
            {remainingCount}
          </div>
        )}
      </div>
    )
  }

  const hasMany = galleryImages.length > 1
  const rootClassName = `${styles.skillGallery} ${!hasMany ? styles.single : ''}`

  return (
    <div className={rootClassName}>
      <ImageGallery
        items={galleryImages}
        renderThumbInner={renderThumbInner}
        renderLeftNav={(onClick, disabled) => (
          <button
            type="button"
            onClick={onClick}
            className={styles.leftArrow}
            aria-label="Предыдущее изображение"
            disabled={disabled}
          >
            <ArrowLeft />
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            type="button"
            onClick={onClick}
            className={styles.rightArrow}
            aria-label="Следующее изображение"
            disabled={disabled}
          >
            <ArrowRight />
          </button>
        )}
        showPlayButton={false}
        showFullscreenButton={false}
        showThumbnails={hasMany}
        showNav={hasMany}
        thumbnailPosition="right"
        showBullets={false}
      />
    </div>
  )
}

export default SkillGallery
