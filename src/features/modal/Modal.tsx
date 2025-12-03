import { memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import ModalUI, { type ModalUIProps } from './modal-ui/ModalUI';

const modalRoot = document.getElementById('modals');

function Modal({ title, onClose, children }: ModalUIProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
}

export default memo(Modal);
