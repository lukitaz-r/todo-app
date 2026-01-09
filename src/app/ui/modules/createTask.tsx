import styles from '../css/page.module.css'
import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';

export default function CreateTask() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button className={`${styles.actionButton} ${styles.createButton}`} onClick={() => setIsModalOpen(true)}>
        Crear Tarea
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAdd}
        title="Crear Tarea"
        message="Describe tu tarea"
        isCreateTask={true}
      />
    </>
  );
}