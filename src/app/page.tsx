'use client'
import styles from '@/app/ui/css/page.module.css'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { deleteAllTasks } from '@/lib/features/tasks/tasksSlice';
import { getOrCreateDeviceId } from '@/lib/cookieUtils';

import TaskBoard from '@/app/ui/modules/taskBoard'
import CreateTask from '@/app/ui/modules/createTask'
import ConfirmationModal from '@/app/ui/modules/ConfirmationModal';


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev <= 1 ? totalPages : prev - 1));
  };

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
    <main className={styles.mainframe}>
      {/* Header */}
      <header className={styles.header}>
        {/* Briefcase Icon */}
        <div className={styles.briefcaseIcon} role="img" aria-label="Briefcase Icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>

        {/* Center Check Icon */}
        <div className={styles.titleContainer}>
          <div className={styles.checkTitleIcon} role="img" aria-label="Check Icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
        </div>

        {/* Social Icons */}
        <ul className={styles.socialIcons} aria-label="Social Links">
          <li className={styles.socialIcon} aria-label="GitHub">
            {/* Github */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </li>
          <li className={styles.socialIcon} aria-label="LinkedIn">
            {/* LinkedIn */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color="#0077b5">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </li>
        </ul>
      </header>

      {/* Task Board */}
      <section className={styles.taskContainer} aria-label="Task Board">
        <TaskBoard currentPage={currentPage} />
      </section>

      {/* Footer Info */}
      {items.length > itemsPerPage && (
        <nav className={styles.footerParams} aria-label="Pagination">
          <span>{currentPage}/{totalPages}</span>
          <div className={styles.arrowContainer}>
            <button className={styles.arrowLeft} onClick={handlePreviousPage} aria-label="Previous Page" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button className={styles.arrowRight} onClick={handleNextPage} aria-label="Next Page" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </nav>
      )}

      {/* Action Buttons */}
      <div className={styles.buttonContainer}>
        <CreateTask />
        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={handleDeleteAll}>
          Borrar
        </button>
      </div>

      <footer className={styles.signature}>
        BY LUCA RAMIREZ
      </footer>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Tasks"
        message="Are you sure you want to delete all your tasks? This action cannot be undone."
        isCreateTask={false}
      />
    </main>
  );
}
