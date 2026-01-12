import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';

interface CreateTaskProps {
  isLimitReached?: boolean;
}

export default function CreateTask({ isLimitReached }: CreateTaskProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    if (!isLimitReached) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button 
        className={`px-6 py-2 font-bold text-white rounded-md transition-colors delay-100 ${isLimitReached ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:filter-[brightness(0.9)] hover:cursor-pointer active:cursor-default'}`} 
        onClick={handleAdd}
        disabled={isLimitReached}
        title={isLimitReached ? "Task limit reached (20 pages max)" : "Create new task"}
      >
        Create Task
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAdd}
        title="Create Task"
        message="Describe your task"
        isCreateTask={true}
      />
    </>
  );
}