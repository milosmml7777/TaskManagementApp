import { Link } from 'react-router-dom';
import { formatDate, isTaskOverdue, truncateText } from '../utils/taskHelpers';
import type { Task } from '../utils/types';

type TaskItemProps = {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({
  task,
  isSelected,
  onSelect,
  onToggleCompletion,
  onDelete,
}: TaskItemProps) {
  const overdue = isTaskOverdue(task);
  const titlePreview = truncateText(task.title, 50);
  const descriptionPreview = task.description
    ? truncateText(task.description, 50)
    : 'No description provided.';

  return (
    <article
      className={`task-item ${task.completed ? 'task-complete' : ''} ${
        isSelected ? 'task-item-selected' : ''
      }`}
    >
      <div className="task-item-top">
        <button
          className={`select-button ${isSelected ? 'is-selected' : ''}`}
          type="button"
          aria-pressed={isSelected}
          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${task.title}`}
          onClick={() => onSelect(task.id, !isSelected)}
        >
          {isSelected ? 'Selected for bulk actions' : 'Select task'}
        </button>

        <button
          className={`status-pill ${task.completed ? 'is-done' : overdue ? 'is-overdue' : ''}`}
          type="button"
          onClick={() => onToggleCompletion(task.id)}
        >
          {task.completed ? 'Completed' : overdue ? 'Overdue' : 'Mark complete'}
        </button>
      </div>

      <div className="task-item-body">
        <div className="task-copy">
          <Link className="task-title-link" to={`/task/${task.id}`}>
            <h3>{titlePreview}</h3>
          </Link>
          <p>{descriptionPreview}</p>
          <div className="task-meta">
            <span>{task.category}</span>
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
        </div>

        <div className="task-actions task-actions-inline">
          <Link className="ghost-button" to={`/task/${task.id}`}>
            View
          </Link>
          <Link className="ghost-button" to={`/edit/${task.id}`}>
            Edit
          </Link>
          <button
            className="danger-button"
            type="button"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
