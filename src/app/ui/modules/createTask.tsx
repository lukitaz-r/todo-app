import styles from '../css/page.module.css'
import Image from 'next/image';
import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';

export default function CreateTask() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button className={styles.buttonCreateTask} onClick={() => setIsModalOpen(true)}>
        Create Task
        <Image
          src='/create.svg'
          alt='Create task logo svg'
          width={32}
          height={32}
          className={styles.buttonCreateTaskLogo}
        />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAdd}
        title="Create Task"
        message="Describe your event"
        isCreateTask={true}
      />
    </>
  );
}