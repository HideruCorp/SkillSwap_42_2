/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AddIcon from '@shared/assets/img/add.svg?react';
import CrossIcon from '@shared/assets/img/cross.svg?react';
import type { AvatarPickerProps, FileWithPreview } from './types';
import styles from './avatar-picker.module.scss';

export function AvatarPicker({
  onAvatarChange,
  initialAvatarUrl,
  maxSize = 5 * 1024 * 1024, // 5MB по умолчанию
  className = '',
  size = 72,
}: AvatarPickerProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [preview, setPreview] = useState<string | null>(initialAvatarUrl || null);
  const [error, setError] = useState<string>('');

  // Обновляем превью при изменении initialAvatarUrl
  useEffect(() => {
    if (initialAvatarUrl && !file) {
      setPreview(initialAvatarUrl);
    }
  }, [initialAvatarUrl, file]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');

      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];

      // Проверка размера
      if (selectedFile.size > maxSize) {
        setError(`Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      // Создаем превью
      const fileWithPreview: FileWithPreview = {
        ...selectedFile,
        preview: URL.createObjectURL(selectedFile),
      };

      setFile(fileWithPreview);
      setPreview(fileWithPreview.preview || null);
      onAvatarChange(selectedFile);
    },
    [maxSize, onAvatarChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize,
    multiple: false,
    noClick: true,
  });

  const removeAvatar = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }

      setFile(null);
      setPreview(null);
      onAvatarChange(null);
      setError('');
    },
    [file, onAvatarChange]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      open();
    },
    [open]
  );

  // Очистка превью при размонтировании
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <div className={`${styles.container} ${className}`} style={{ '--avatar-size': `${size}px` } as React.CSSProperties}>
      <div
        {...getRootProps()}
        className={`${styles.avatarWrapper} ${isDragActive ? styles.dragActive : ''} ${error ? styles.error : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Загрузка аватара"
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <img src={preview} alt="Аватар" className={styles.avatar} />
            <button
              type="button"
              className={styles.removeButton}
              onClick={removeAvatar}
              aria-label="Удалить аватар"
            >
              <CrossIcon className={styles.removeIcon} />
            </button>
          </>
        ) : (
          <>
            <svg
              className={styles.placeholderIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.982 18.725C17.2831 17.8 16.3791 17.0498 15.3411 16.5336C14.303 16.0173 13.1593 15.7491 12 15.75C10.8407 15.7491 9.69695 16.0173 8.65891 16.5336C7.62087 17.0498 6.71684 17.8 6.01799 18.725M17.982 18.725C19.3455 17.5122 20.3081 15.9136 20.7422 14.1411C21.1762 12.3686 21.0613 10.5061 20.4125 8.80049C19.7637 7.09488 18.6117 5.62679 17.1094 4.59091C15.6071 3.55503 13.8253 3.00031 12.0005 3.00031C10.1757 3.00031 8.39392 3.55503 6.89159 4.59091C5.38926 5.62679 4.23732 7.09488 3.58852 8.80049C2.93973 10.5061 2.82474 12.3686 3.25881 14.1411C3.69288 15.9136 4.65449 17.5122 6.01799 18.725M17.982 18.725C16.3358 20.1929 14.2055 21.0028 12 21C9.79409 21.003 7.66442 20.1931 6.01799 18.725M15 9.75001C15 10.5457 14.6839 11.3087 14.1213 11.8713C13.5587 12.4339 12.7956 12.75 12 12.75C11.2043 12.75 10.4413 12.4339 9.87867 11.8713C9.31606 11.3087 8.99999 10.5457 8.99999 9.75001C8.99999 8.95436 9.31606 8.1913 9.87867 7.62869C10.4413 7.06608 11.2043 6.75001 12 6.75001C12.7956 6.75001 13.5587 7.06608 14.1213 7.62869C14.6839 8.1913 15 8.95436 15 9.75001Z"
                stroke="#253017"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <button
              type="button"
              className={styles.addButton}
              onClick={handleClick}
              aria-label="Добавить аватар"
            >
              <AddIcon className={styles.addIcon} />
            </button>
          </>
        )}
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

export default AvatarPicker;

