import { useDispatch } from 'react-redux';
import styles from '../css/page.module.css';
import { useState, useEffect } from 'react';
import { AppDispatch } from '@/lib/store';
import { addTask } from '@/lib/features/tasks/tasksSlice';

interface ConfirmationModalProps {
  isOpen: boolean;
  isCreateTask: boolean;
  isEditTask?: boolean;
  initialData?: { name: string; description: string };
  onClose: () => void;
  onConfirm: () => void;
  onEdit?: (data: { name: string; description: string }) => Promise<void>;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  isCreateTask,
  isEditTask,
  initialData,
  onClose,
  onConfirm,
  onEdit,
  title,
  message,
}: ConfirmationModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      if (isEditTask && initialData) {
        setNewName(initialData.name);
        setNewDescription(initialData.description);
      } else {
        setNewName('');
        setNewDescription('');
      }
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditTask, initialData]);

  if (!shouldRender) return null;

  const handleClose = () => {
    if (isCreateTask || isEditTask) {
      setNewName('');
      setNewDescription('');
      setError(null);
    }
    onClose();
  };

  const handleAdd = async () => {
    if (!newName) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await dispatch(addTask({ name: newName, description: newDescription })).unwrap();
      setNewName('');
      setNewDescription('');
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error adding item';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInternal = async () => {
    if (!newName) {
      setError('Name is required');
      return;
    }
    if (!onEdit) return;

    setLoading(true);
    setError(null);
    try {
      await onEdit({ name: newName, description: newDescription });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error editing item';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (isCreateTask) {
      handleAdd();
    } else if (isEditTask) {
      handleEditInternal();
    } else {
      onConfirm();
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.modalOverlayClosing : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modalContent} ${(isCreateTask || isEditTask) ? styles.modalContentCreateTask : ''} ${isClosing ? styles.modalContentClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <h2 id="confirmation-modal-title" className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
        <div className={styles.modalInputs}>
          {(isCreateTask || isEditTask) ? (
            <>
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.inputCreateTask + ' ' + styles.inputName}
                disabled={loading}
              />
              <textarea
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={styles.inputCreateTask + ' ' + styles.inputDescription}
                disabled={loading}
              />
            </>
          ) : ''}
        </div>


        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalButton} ${(isCreateTask || isEditTask) ? styles.confirmTaskButton : styles.confirmEraseButton}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isEditTask ? 'Save' : 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
