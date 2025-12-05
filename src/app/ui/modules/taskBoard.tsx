import styles from '@/app/ui/css/page.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchTasks, deleteTask, updateTask } from '@/lib/features/tasks/tasksSlice';
import ConfirmationModal from './ConfirmationModal';
import { Task } from '@/app/types/tasks';

export default function TaskBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleComplete = (id: string) => {
    setCompletingTaskId(id);
    setTimeout(() => {
      dispatch(deleteTask(id));
      setCompletingTaskId(null);
    }, 500); // Wait for animation
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
    return (
      <>
        <div className={styles.taskItemContainer}>
          {items.map((item: Task) => {
            const id = item._id || item.id;
            const isCompleting = completingTaskId === id;
            return (
              <div key={id} className={`${styles.taskItem} ${isCompleting ? styles.taskItemCompleting : ''}`}>
                <div className={styles.taskItemDescription}>
                  <strong>
                    {item.name}
                  </strong>
                  <p>
                    {item.description}
                  </p>
                </div>
                <div className={styles.taskItemActions}>
                  <button className={styles.completeButton} onClick={() => handleComplete(String(id!))} title="Complete">
                    <Image src="/check.svg" width={24} height={24} alt="Complete" />
                  </button>
                  <button className={styles.editButton} onClick={() => handleEdit(item)} title="Edit">
                    <Image src="/edit.svg" width={24} height={24} alt="Edit" />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(String(id!))} title="Delete">
                    <Image src="/trash.svg" width={24} height={24} alt="Delete" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {editingTask && (
          <ConfirmationModal
            isOpen={!!editingTask}
            isCreateTask={false}
            isEditTask={true}
            initialData={{ name: editingTask.name, description: editingTask.description }}
            onClose={() => setEditingTask(null)}
            onConfirm={() => { }} // Not used for edit
            onEdit={saveEdit}
            title="Edit Task"
            message="Update your task details"
          />
        )}
      </>
    )
  } else {
    return (
      <>
        <h3 className={styles.notYetTitle}>
          You haven&apos;t created <br /> tasks yet.
        </h3>
        <Image
          src="/x.svg"
          className={styles.notYetLogo}
          width={250}
          height={250}
          alt="Empty tasks"
        />
      </>
    )
  }
}