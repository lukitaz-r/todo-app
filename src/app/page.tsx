'use client'
import styles from '@/app/ui/css/page.module.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { deleteAllTasks } from '@/lib/features/tasks/tasksSlice';
import { getOrCreateDeviceId } from '@/lib/cookieUtils';

import TaskBoard from '@/app/ui/modules/taskBoard'
import CreateTask from '@/app/ui/modules/createTask'
import ConfirmationModal from '@/app/ui/modules/ConfirmationModal';

import Image from 'next/image';


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getOrCreateDeviceId();
  }, []);

  const handleDeleteAll = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteAll = () => {
    dispatch(deleteAllTasks());
  };

  return (
    <div className={styles.mainframe}>
      <header>
        <h1>TO-DO APP | By Luca Ramirez</h1>
      </header>
      <main className={styles.mainCard}>
        <div className={styles.mainCardHeader}>
          <button className={`${styles.buttonEraseAll}`} onClick={handleDeleteAll}>
            Delete ALL
            <Image
              src='/trashcan.svg'
              alt='Erase All can svg'
              width={32}
              height={32}
              className={styles.buttonEraseAllLogo}
            />
          </button>
          <CreateTask />
        </div>
        <div className={styles.taskCard}>
          <TaskBoard />
        </div>
      </main>
      <footer className={styles.footer}>
        Developed by Luca Ramirez ©2025 - Barranqueras, Chaco, Argentina. - Contact me: <a href="https://www.linkedin.com/in/lukitaz-r/">LinkedIn</a> | <a href="https://github.com/lukitaz-r">GitHub</a> | <a href="https://lucaramirez.vercel.app/">Portfolio</a>
      </footer>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Tasks"
        message="Are you sure you want to delete all your tasks? This action cannot be undone."
        isCreateTask={false}
      />
    </div>
  );
}
