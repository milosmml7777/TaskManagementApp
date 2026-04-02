import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTasks } from '../context/TaskContext';
import { formatDate } from '../utils/taskHelpers';

export function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTask, getTaskById, toggleTaskCompletion } = useTasks();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const task = id ? getTaskById(id) : undefined;

  if (!task) {
    return (
      <section className="card details-card">
        <h1>Task not found</h1>
        <p>The requested task could not be found.</p>
        <Link className="primary-button" to="/">
          Back to dashboard
        </Link>
      </section>
    );
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="card details-card">
        <div className="details-top">
          <div>
            <p className="eyebrow">Task details</p>
            <h1>{task.title}</h1>
          </div>
          <button
            className={`status-pill ${task.completed ? 'is-done' : ''}`}
            type="button"
            onClick={() => toggleTaskCompletion(task.id)}
          >
            {task.completed ? 'Completed' : 'Mark complete'}
          </button>
        </div>

        <div className="details-grid">
          <div className="details-block details-description-block">
            <span className="field-label">Description</span>
            <p>{task.description || 'No description provided.'}</p>
          </div>
          <div className="details-block">
            <span className="field-label">Due date</span>
            <p>{formatDate(task.dueDate)}</p>
          </div>
          <div className="details-block">
            <span className="field-label">Category</span>
            <p>{task.category}</p>
          </div>
          <div className="details-block">
            <span className="field-label">Completed</span>
            <p>{task.completed ? 'Yes' : 'No'}</p>
          </div>
          <div className="details-block">
            <span className="field-label">Created at</span>
            <p>{formatDate(task.createdAt)}</p>
          </div>
        </div>

        <div className="task-actions">
          <Link className="ghost-button" to={`/edit/${task.id}`}>
            Edit task
          </Link>
          <button className="danger-button" type="button" onClick={handleDelete}>
            Delete task
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={`Delete "${task.title}"?`}
        message="This task will be removed from your dashboard and you will be taken back to the main list."
        confirmLabel="Delete task"
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
