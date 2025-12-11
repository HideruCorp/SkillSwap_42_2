export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_OPTIONS: Required<ImageCompressionOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  mimeType: 'image/jpeg',
};

/**
 * Сжимает изображение и возвращает Data URL
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Сохраняем пропорции
      if (width > opts.maxWidth) {
        height = (height * opts.maxWidth) / width;
        width = opts.maxWidth;
      }
      if (height > opts.maxHeight) {
        width = (width * opts.maxHeight) / height;
        height = opts.maxHeight;
      }

      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Возвращаем Data URL напрямую
      const dataUrl = canvas.toDataURL(opts.mimeType, opts.quality);

      URL.revokeObjectURL(img.src);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Сжимает массив файлов
 */
export async function compressImages(
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<string[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}
