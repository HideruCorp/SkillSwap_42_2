/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import { useState, useCallback } from 'react';
import GalleryAddIcon from '@shared/assets/img/gallery-Add.svg?react';
import CrossIcon from '@shared/assets/img/cross.svg?react';
import { useDropzone } from 'react-dropzone';
import type { FileWithPreview, DragDropProps } from './types';
import styles from './drag-drop.module.scss';

export function DragDrop({
  onFilesChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  label = 'Перетащите или выберите изображения навыка',
  buttonText = 'Выбрать изображения',
  className = '',
}: DragDropProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');

      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Максимальное количество файлов: ${maxFiles}`);
        return;
      }

      const newFilesWithPreview: FileWithPreview[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
      }));

      const updatedFiles = [...files, ...newFilesWithPreview];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxSize,
    maxFiles: maxFiles - files.length,
    multiple: true,
    noClick: true,
  });

  const removeFile = useCallback(
    (index: number) => {
      const fileToRemove = files[index];

      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const clearAllFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setFiles([]);
    onFilesChange([]);
  }, [files, onFilesChange]);

  const isMaxFilesReached = files.length >= maxFiles;

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isMaxFilesReached) {
        open();
      }
    },
    [isMaxFilesReached, open]
  );

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${
          isMaxFilesReached ? styles.disabled : ''
        } ${error ? styles.error : ''}`}
        aria-disabled={isMaxFilesReached}
        role="button"
        tabIndex={0}
        aria-label="Область загрузки файлов"
      >
        <input {...getInputProps()} />
        <div className={styles.dropzoneContent}>
          <p className={styles.label}>{label}</p>
          <button
            type="button"
            className={styles.selectButton}
            onClick={handleButtonClick}
            disabled={isMaxFilesReached}
          >
            <GalleryAddIcon className={styles.buttonIcon} />
            {buttonText}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {files.length > 0 && (
        <div className={styles.filesList}>
          <div className={styles.filesHeader}>
            <span>Загружено файлов: {files.length}</span>
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearAllFiles}
              aria-label="Удалить все изображения"
            >
              <CrossIcon className={styles.clearIcon} />
            </button>
          </div>

          <div className={styles.filesGrid}>
            {files.map((file, index) => (
              <div key={file.id} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <svg className={styles.fileIcon} width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M14 11.3333V4.66667C14 3.92929 13.403 3.33333 12.6667 3.33333H9.33333C8.97971 3.33333 8.64057 3.19286 8.39052 2.94281L7.72486 2.27715C7.47481 2.0271 7.13567 1.88667 6.78205 1.88667H3.33333C2.59695 1.88667 2 2.48262 2 3.22V11.3333C2 12.0697 2.59695 12.6667 3.33333 12.6667H12.6667C13.403 12.6667 14 12.0697 14 11.3333Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className={styles.fileName} title={file.name}>
                    {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.removeFileButton}
                  onClick={() => removeFile(index)}
                  aria-label={`Удалить файл ${file.name}`}
                >
                  <CrossIcon className={styles.removeIcon} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DragDrop;
