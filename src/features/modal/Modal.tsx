import type { ModalUIProps } from './modal-ui/ModalUI'
import { memo, useEffect } from 'react'

import ReactDOM from 'react-dom'
import ModalUI from './modal-ui/ModalUI'

const modalRoot = document.getElementById('modals')

function Modal({ title, onClose, children, className }: ModalUIProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleScroll = () => {
      onClose()
    }

    document.addEventListener('keydown', handleEsc)
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [onClose])

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose} className={className}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement,
  )
}

export default memo(Modal)
