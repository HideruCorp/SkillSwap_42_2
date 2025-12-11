export interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export interface DragDropProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSize?: number;
  label?: string;
  buttonText?: string;
  className?: string;
}
