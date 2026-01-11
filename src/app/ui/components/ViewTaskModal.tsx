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
      className={`fixed inset-0 flex justify-center items-center z-1000 backdrop-blur-sm w-full h-full bg-black/50 p-4 ${isClosing ? 'animate-[fadeOut_0.3s_ease-in_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'}`}
      onClick={onClose}
    >
      <div
        className={`w-full bg-white p-6 rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 max-w-sm ${isClosing ? 'animate-[scaleOut_0.3s_ease-in_forwards]' : 'animate-[scaleIn_0.3s_ease-out_forwards]'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-task-title"
      >
        <h2 id="view-task-title" className="mb-3 text-xl font-bold text-gray-800 text-center">{title}</h2>
        <div className="mb-3 text-lg text-gray-600 text-center" style={{ whiteSpace: 'pre-wrap', textAlign: 'center', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden', overflowWrap: 'break-word' }}>
          {description}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
