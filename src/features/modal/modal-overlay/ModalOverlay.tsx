import styles from './modal-overlay.module.scss';

interface ModalOverlayProp {
  onClick: () => void;
}

function ModalOverlay({ onClick }: ModalOverlayProp) {
  return <div role="dialog" className={styles.overlay} onClick={onClick} aria-hidden="true" />;
}

export default ModalOverlay;
