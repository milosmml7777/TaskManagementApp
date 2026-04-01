import { Link } from 'react-router-dom';
import { formatDate, isTaskOverdue } from '../utils/taskHelpers';
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

  return (
    <article className={`task-item ${task.completed ? 'task-complete' : ''}`}>
      <div className="task-item-top">
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(event) => onSelect(task.id, event.target.checked)}
            aria-label={`Select ${task.title}`}
          />
          <span>Select</span>
        </label>

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
            <h3>{task.title}</h3>
          </Link>
          <p>{task.description || 'No description provided.'}</p>
        </div>

        <div className="task-meta">
          <span>{task.category}</span>
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
      </div>

      <div className="task-actions">
        <Link className="ghost-button" to={`/task/${task.id}`}>
          View
        </Link>
        <Link className="ghost-button" to={`/edit/${task.id}`}>
          Edit
        </Link>
        <button className="danger-button" type="button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
