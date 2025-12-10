/**
 * Конвертирует Blob в Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Проверяет, является ли строка Data URL
 */
export function isDataUrl(str: string): boolean {
  return str.startsWith('data:');
}

/**
 * Форматирует размер файла
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Примерный размер Data URL в байтах
 */
export function estimateDataUrlSize(dataUrl: string): number {
  // Data URL формат: data:mime;base64,<data>
  const base64Part = dataUrl.split(',')[1] || '';
  // Base64 использует ~1.33x от оригинала
  return Math.round((base64Part.length * 3) / 4);
}
