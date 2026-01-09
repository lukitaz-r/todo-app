import styles from '../css/page.module.css';
import { useState, useEffect } from 'react';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function ViewTaskModal({
  isOpen,
  onClose,
  title,
  description,
}: ViewTaskModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.modalOverlayClosing : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.modalContentClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-task-title"
      >
        <h2 id="view-task-title" className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalMessage} style={{ whiteSpace: 'pre-wrap', textAlign: 'center', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden', overflowWrap: 'break-word' }}>
          {description}
        </div>

        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
