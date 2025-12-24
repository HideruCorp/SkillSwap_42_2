export interface FileWithPreview {
  file: File
  preview?: string
  id: string
  name: string
}

export interface DragDropProps {
  onFilesChange: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxSize?: number
  label?: string
  buttonText?: string
  className?: string
}
