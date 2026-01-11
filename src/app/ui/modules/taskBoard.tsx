import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchTasks, deleteTask, updateTask } from '@/lib/features/tasks/tasksSlice';
import Image from 'next/image';
import ConfirmationModal from '@/app/ui/components/ConfirmationModal';
import ViewTaskModal from '@/app/ui/components/ViewTaskModal';
import { Task } from '@/app/types/tasks';

interface TaskBoardProps {
  currentPage?: number;
}

export default function TaskBoard({ currentPage = 1 }: TaskBoardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showEmptyPageFall, setShowEmptyPageFall] = useState(false);

  // Track if this is the initial render (skip animations on first load/refresh)
  const isInitialRender = useRef(true);
  const prevItemsLength = useRef(items.length);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  // After mount, set isInitialRender to false so future page changes animate
  useEffect(() => {
    // Small delay to ensure the first render completes without animation
    const timer = setTimeout(() => {
      isInitialRender.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Detect when current page becomes empty (deleted all items on page > 1)
  useEffect(() => {
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageItems = items.slice(startIndex, startIndex + itemsPerPage);

    // If we're on page > 1 and items were deleted (length decreased) and current page is now empty
    if (currentPage > 1 && prevItemsLength.current > items.length && currentPageItems.length === 0) {
      setShowEmptyPageFall(true);
      // Reset after animation completes
      const timer = setTimeout(() => {
        setShowEmptyPageFall(false);
      }, 1000); // Match animation duration
      return () => clearTimeout(timer);
    }

    prevItemsLength.current = items.length;
  }, [items.length, currentPage]);

  const handleDelete = async (id: string) => {
    if (id) {
      setDeletingId(id);
      setTimeout(() => {
        dispatch(deleteTask(id)).then(() => setDeletingId(null));
      }, 250);
    }
  }

  const handleComplete = (task: Task) => {
    dispatch(updateTask({ ...task, completed: !task.completed }))
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const saveEdit = async (data: { name: string; description: string }) => {
    if (editingTask) {
      await dispatch(updateTask({ ...editingTask, ...data })).unwrap();
      setEditingTask(null);
    }
  }

  if (status === 'loading') return (
    <div className="flex items-center justify-center h-[55vh]">
      <svg className="mr-3 size-20 animate-spin" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
        <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
      </svg>
    </div>
  )

  if (status === 'failed') return <p>Error: {error}</p>

  if (items.length > 0) {
    const itemsPerPage = 4;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Calculate indices for Prev, Curr, Next (Circular)
    const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
    const nextPage = currentPage === totalPages ? 1 : currentPage + 1;

    // Helper to get items for a generic page number
    const getPageItems = (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      return items.slice(startIndex, startIndex + itemsPerPage);
    };

    // Render a single task list
    const renderTaskList = (pageItems: Task[], role: 'prev' | 'current' | 'next') => {
      let containerClass = "flex flex-col w-full p-0 m-0 md:p-6 md:bg-white md:h-full md:rounded-[5px] items-center absolute inset-0";

      if (role === 'current') {
        // Current page appears behind the falling previous page
        if (isInitialRender.current) {
          containerClass += " z-10"; // No animation on first load
        } else {
          containerClass += " z-10"; // Just appear, no animation needed (prev falls away to reveal this)
        }
      } else if (role === 'prev') {
        // Previous page: falls off and fades out on MD screens
        if (isInitialRender.current) {
          containerClass += " z-20 hidden"; // Hidden on first load
        } else {
          containerClass += " z-20 hidden md:flex md:animate-[paperFall_1s_ease-in_forwards]"; // Exit animation
        }
      } else {
        containerClass += " z-0 hidden"; // Always hidden, just pre-rendered
      }

      return (
        <ul className={containerClass} key={role}>
          {pageItems.map((item: Task) => {
            const id = item._id || item.id;
            const isCompleted = !!item.completed;
            const isDeleting = deletingId === id;
            return (
              <li
                key={id}
                className={`flex items-center gap-[15px] border rounded-2xl p-4 transition-all duration-300 ease-in-out overflow-hidden w-full bg-[#f0f0f0] mb-[15px] max-h-[200px] ${isCompleted ? 'opacity-90 bg-[#e6e6e6]' : ''} ${isDeleting ? 'opacity-0 scale-95 translate-x-4 max-h-0 p-0 mb-0 border-0' : ''}`}
              >
                <button
                  type="button"
                  className="position-relative flex items-center justify-center shrink-0 cursor-pointer active:cursor-default w-8 h-8 border-2 rounded-[50%] bg-transparent"
                  onClick={() => handleComplete(item)}
                  role="checkbox"
                  aria-checked={isCompleted}
                  aria-label={`Mark ${item.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                >
                  {isCompleted && (
                    <Image key={id} alt="check" aria-hidden="true" width={24} height={24} src="/check.svg" />
                  )}
                </button>

                <div className="flex flex-col w-full">
                  <div className="pt-0.5 pb-0.5 pl-2.5 pr-2.5">
                    <span className={`${isCompleted ? 'text-gray-400 line-through decoration-3 decoration-black' : 'text-gray-800'} font-bold text-[16px] m-0 w-full overflow-hidden whitespace-nowrap overflow-ellipsis block`}>{item.name}</span>
                  </div>

                  {item.description && (
                    <>
                      <div className="h-0.5 bg-gray-700 w-[95%] mx-auto mt-1.25 mb-1.25"></div>
                      <div className="flex items-center justify-center pt-px pb-px px-2.5">
                        <span className={`${isCompleted ? 'text-gray-400 line-through decoration-3 decoration-black' : 'text-gray-800'} text-[14px] m-0 w-full overflow-hidden whitespace-nowrap overflow-ellipsis block`}>
                          {item.description.length > 20
                            ? `${item.description.substring(0, 20)}...`
                            : item.description}
                        </span>
                        {item.description.length > 20 && (
                          <button
                            className="bg-none border-none cursor-pointer text-gray-600 pt-0 pb-0 px-[5px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewTask(item);
                            }}
                            title="View Details"
                            aria-label={`View details for ${item.name}`}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex ml-auto gap-6.25 flex-col max-w-[20%]">
                  <button
                    className="text-shadow-black cursor-pointer border p-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-100 bg-transparent"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                    aria-label={`Edit ${item.name}`}
                    disabled={isCompleted}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>

                  <button
                    className="bg-red-500 text-shadow-black border p-1.5 cursor-pointer text-white"
                    onClick={() => handleDelete(String(id || ''))}
                    title="Delete"
                    aria-label={`Delete ${item.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      );
    };

    return (
      // Key on wrapper forces React to completely replace content on page change
      <div className="relative w-full h-full perspective-[2000px] overflow-hidden" key={currentPage}>
        {/* Render Previous Page (Background on MD) */}
        {renderTaskList(getPageItems(prevPage), 'prev')}

        {/* Render Current Page (Active, animating) */}
        {renderTaskList(getPageItems(currentPage), 'current')}

        {/* Render Next Page (Hidden buffer) */}
        {renderTaskList(getPageItems(nextPage), 'next')}

        {/* Empty page fall animation - shows when all items on current page are deleted */}
        {showEmptyPageFall && (
          <div
            className="absolute inset-0 z-30 md:p-6 md:bg-white md:h-full md:rounded-[5px] animate-[paperFall_1s_ease-in_forwards]"
            aria-hidden="true"
          />
        )}

        {/* Modals */}
        {editingTask && (
          <ConfirmationModal
            isOpen={!!editingTask}
            isCreateTask={false}
            isEditTask={true}
            initialData={{ name: editingTask.name, description: editingTask.description || '' }}
            onClose={() => setEditingTask(null)}
            onConfirm={() => { }}
            onEdit={saveEdit}
            title="Edit Task"
            message="Update your task details"
          />
        )}
        <ViewTaskModal
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
          title={viewTask?.name || ''}
          description={viewTask?.description || ''}
        />
      </div>
    );
  }
}