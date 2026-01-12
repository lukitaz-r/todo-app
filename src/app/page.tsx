'use client'
import styles from '@/app/ui/css/page.module.css'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { deleteAllTasks } from '@/lib/features/tasks/tasksSlice';
import { getOrCreateDeviceId } from '@/lib/cookieUtils';

import TaskBoard from '@/app/ui/modules/taskBoard'
import CreateTask from '@/app/ui/components/CreateTask'
import ConfirmationModal from '@/app/ui/components/ConfirmationModal';

/**
 * Home Page Component
 * Acts as the main controller for the application layout and state.
 * Actúa como el controlador principal para el diseño y estado de la aplicación.
 * 
 * Responsibilities:
 * - Manages pagination state (current page, direction). / Gestiona el estado de paginación.
 * - Handles dynamic capacity (items per page) updates from TaskBoard. / Maneja la capacidad dinámica desde TaskBoard.
 * - Enforces the maximum page limit (20 pages). / Impone el límite máximo de páginas (20).
 * - Coordinates global actions like "Delete All". / Coordina acciones globales como "Borrar Todo".
 */
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default start value / Valor inicial por defecto
  const [direction, setDirection] = useState<'forward' | 'backward' | null>(null);

  const arrowStyle = 'size-[28px] cursor-pointer bg-none border-none';

  // Calculate total pages based on dynamic capacity
  // Calcular el total de páginas basado en la capacidad dinámica
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;

  const handleNextPage = () => {
    if (totalPages > 1) {
      setDirection('forward');
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }
  };

  const handlePreviousPage = () => {
    if (totalPages > 1) {
      setDirection('backward');
      setCurrentPage((prev) => (prev <= 1 ? totalPages : prev - 1));
    }
  };

  /**
   * Callback received from TaskBoard to update capacity based on available screen height.
   * Callback recibido de TaskBoard para actualizar la capacidad según la altura de pantalla disponible.
   */
  const handleCapacityChange = (capacity: number) => {
    // Only update if changed to prevent render loops, and ensure at least 1 item
    if (capacity !== itemsPerPage && capacity > 0) {
      setItemsPerPage(capacity);
      // If resize makes current page invalid, reset to 1
      // Si el redimensionamiento hace que la página actual sea inválida, resetear a 1
      const newTotalPages = Math.ceil(items.length / capacity) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    getOrCreateDeviceId();
  }, []);

  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  }, [currentPage, totalPages]);

  const handleDeleteAll = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteAll = () => {
    dispatch(deleteAllTasks());
  };

  // Limit check: Max 20 pages allowed
  // Verificación de límite: Máximo 20 páginas permitidas
  const isLimitReached = totalPages >= 20 && items.length >= 20 * itemsPerPage;

  return (
    <main className="flex flex-col w-full max-w-100 md:max-w-[600px] p-5 bg-transparent mt-0 mb-0 mx-auto">
      <header className="flex items-center justify-between mb-5">
        <div className="w-full flex items-center justify-center grow">
          {/* Center Check Icon */}
          <div className="w-15 h-15 text-[#0070f3] mr-1" role="img" aria-label="Check Icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <h1 className="hidden md:block text-[#0070f3] text-[40px] font-bold">TO-DO APP</h1>
        </div>
      </header>

      {/* TaskBoard Section */}
      <section className={`relative flex flex-col gap-3.75 mb-10 w-full h-[57vh] md:h-[65vh] md:rounded-[20px] md:bg-[#015f38] md:p-5`} aria-label="Task Board">
        {/* Clipboard Clip (Only visible on md+) / Clip del portapapeles (Solo visible en md+) */}
        <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 flex-col items-center z-40" aria-hidden="true">
          {/* Metal base */}
          <div className="w-32 h-10 bg-gray-400 rounded-t-lg shadow-inner border-b-4 border-gray-500 flex items-center justify-center">
            {/* Circular hole/hinge */}
            <div className="w-4 h-4 bg-[#015f38] rounded-full border-2 border-gray-500 shadow-md"></div>
          </div>
          {/* Pressure bar */}
          <div className="w-24 h-2 bg-gray-300 rounded-full -mt-1 shadow-sm border border-gray-400"></div>
        </div>

        <TaskBoard
          currentPage={currentPage}
          direction={direction}
          itemsPerPage={itemsPerPage}
          onCapacityChange={handleCapacityChange}
        />
      </section>

      {/*Pagination Controls */}
      {items.length > itemsPerPage && (
        <nav className={`w-full flex justify-between items-center font-bold size-4.5 mb-10`} aria-label="Pagination">
          <span>{currentPage}/{totalPages}</span>
          <div className={`flex gap-2.5`}>
            <button className={arrowStyle} onClick={handlePreviousPage} aria-label="Previous Page" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button className={arrowStyle} onClick={handleNextPage} aria-label="Next Page" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </nav>
      )}

      {/* Action Buttons */}
      <div className={"flex gap-4 w-full"}>
        <CreateTask isLimitReached={isLimitReached} />
        <button className={`flex-1 rounded-[10px] p-3 font-bold  bg-red-700 text-white hover:filter-[brightness(0.9)] hover:cursor-pointer active:cursor-default`} onClick={handleDeleteAll}>
          Delete All
        </button>
      </div>

      <footer className={`xs:mt-[40px] mt-[10px] text-center text-[12px] font-bold letter-spacing-[1px]`}>
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
