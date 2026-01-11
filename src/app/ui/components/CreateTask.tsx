import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';

export default function CreateTask() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:filter-[brightness(0.9)] hover:cursor-pointer active:cursor-default transition-colors delay-100" onClick={handleAdd}>
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