import type { ReactNode } from 'react';
import ModalOverlay from '../modal-overlay/ModalOverlay';
import styles from './modal-ui.module.scss';

export interface ModalUIProps {
  title?: string | ReactNode;
  onClose: () => void;
  children?: ReactNode;
}

function ModalUI({ title, onClose, children }: ModalUIProps) {
  return (
    <>
      <div className={styles.modal} data-testid="modal">
        {title && (
          <div className={styles.header}>
            <h3 className={`${styles.title}`}>{title}</h3>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlay onClick={onClose} />
    </>
  );
}

ModalUI.defaultProps = {
  title: undefined,
  children: undefined,
};

export default ModalUI;
