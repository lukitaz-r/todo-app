import styles from '@/app/ui/css/page.module.css'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchTasks, deleteTask, updateTask } from '@/lib/features/tasks/tasksSlice';
import ConfirmationModal from './ConfirmationModal';
import ViewTaskModal from './ViewTaskModal';
import { Task } from '@/app/types/tasks';
import Image from 'next/image';

interface TaskBoardProps {
  currentPage?: number;
}

export default function TaskBoard({ currentPage = 1 }: TaskBoardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleDelete = (id: string) => {
    if (id) dispatch(deleteTask(id));
  };

  const handleComplete = (task: Task) => {
    dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const saveEdit = async (data: { name: string; description: string }) => {
    if (editingTask) {
      await dispatch(updateTask({ ...editingTask, ...data })).unwrap();
      setEditingTask(null);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  if (items.length > 0) {
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
      <ul className={styles.taskListContainer} key={currentPage}>
        {displayedItems.map((item: Task) => {
          const id = item._id || item.id;
          const isCompleted = !!item.completed;
          return (
            <li key={id} className={`${styles.taskCard} ${isCompleted ? styles.taskCardCompleted : ''}`}>
              <button
                type="button"
                className={`${styles.checkbox}`}
                onClick={() => handleComplete(item)}
                role="checkbox"
                aria-checked={isCompleted}
                aria-label={`Mark ${item.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
              >
                {isCompleted && (
                  <Image alt="" aria-hidden="true" width={24} height={24} src="/check.svg" style={{ color: 'transparent' }} />
                )}
              </button>

              <div className={styles.textGroup}>
                <div className={styles.barTitle}>
                  <span className={styles.realTextTitle}>{item.name}</span>
                </div>

                {item.description && (
                  <>
                    <div className={styles.barSeparator}></div>
                    <div className={styles.barDesc}>
                      <span className={styles.realTextDesc}>
                        {item.description.length > 0
                          ? `${item.description.substring(0, 10)}...`
                          : item.description}
                      </span>
                      {item.description.length > 10 && (
                        <button
                          className={styles.moreInfoButton}
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
              <div className={styles.taskButtonContainer}>

                <button
                  className={styles.editButton}
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
                  className={styles.deleteButton} 
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
        {
          editingTask && (
            <ConfirmationModal
              isOpen={!!editingTask}
              isCreateTask={false}
              isEditTask={true}
              initialData={{ name: editingTask.name, description: editingTask.description || '' }}
              onClose={() => setEditingTask(null)}
              onConfirm={() => { }} // Not used for edit
              onEdit={saveEdit}
              title="Edit Task"
              message="Update your task details"
            />
          )
        }
        <ViewTaskModal
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
          title={viewTask?.name || ''}
          description={viewTask?.description || ''}
        />
      </ul>
    )
  }
}