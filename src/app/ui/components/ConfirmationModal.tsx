import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>();

  // Updated button base styles
  const modalButton = 'px-4 py-2 rounded-lg border-none cursor-pointer font-bold transition-all duration-200 ease-linear flex items-center justify-center text-sm sm:text-base';

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || !shouldRender) return null;

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
      let message = 'Error adding item';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        message = err;
      }
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
      let message = 'Error editing item';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        message = err;
      }
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

  return createPortal(
    <div
      className={`fixed inset-0 flex justify-center items-center z-[9999] backdrop-blur-sm w-full h-full bg-black/50 p-4 ${isClosing ? 'animate-[fadeOut_0.3s_ease-in_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'}`}
      onClick={handleClose}
    >
      <div
        className={`w-full bg-white p-6 rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 ${(isCreateTask || isEditTask) ? 'max-w-md' : 'max-w-sm'} ${isClosing ? 'animate-[scaleOut_0.3s_ease-in_forwards]' : 'animate-[scaleIn_0.3s_ease-out_forwards]'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <h2 id="confirmation-modal-title" className='mb-3 text-xl font-bold text-gray-800 text-center'>{title}</h2>
        <p className={`mb-6 text-base text-gray-600 text-center leading-relaxed`}>{message}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-[scaleIn_0.2s_ease-out_forwards]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-sm font-medium leading-tight">{error}</p>
          </div>
        )}

        <div className={`flex flex-col gap-4 mb-6`}>
          {(isCreateTask || isEditTask) ? (
            <>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Task Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={'w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all shadow-sm'}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <textarea
                  placeholder="Description (Optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={'w-full min-h-[100px] max-h-[200px] resize-y p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all shadow-sm'}
                  disabled={loading}
                />
              </div>
            </>
          ) : ''}
        </div>


        <div className={`flex justify-center gap-3 w-full`}>
          <button
            className={`${modalButton} bg-gray-100 active:cursor-default text-gray-700 hover:bg-gray-200 w-full sm:w-auto flex-1`}
            onClick={handleClose}
            disabled={loading}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${modalButton} ${(isCreateTask || isEditTask) ? 'bg-blue-600 text-white hover:bg-blue-700 hover:filter-[brightness(0.9)] hover:cursor-pointer active:cursor-default' : 'bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer active:cursor-default'} w-full sm:w-auto flex-1 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm`}
            onClick={handleConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (isEditTask ? 'Save Changes' : (isCreateTask ? 'Create Task' : 'Confirm'))}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
