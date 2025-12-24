export interface AvatarPickerProps {
  onAvatarChange: (file: File | null) => void
  initialAvatarUrl?: string
  maxSize?: number
  className?: string
  size?: number
}

export interface FileWithPreview extends File {
  preview?: string
}
