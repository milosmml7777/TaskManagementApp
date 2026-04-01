import { TaskItem } from './TaskItem';
import type { Task } from '../utils/types';

type TaskListProps = {
  tasks: Task[];
  selectedIds: string[];
  onSelectTask: (id: string, selected: boolean) => void;
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskList({
  tasks,
  selectedIds,
  onSelectTask,
  onToggleCompletion,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state card">
        <h2>No tasks yet</h2>
        <p>Add your first task to start tracking work, study, and personal goals.</p>
      </section>
    );
  }

  const selectedSet = new Set(selectedIds);

  return (
    <section className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedSet.has(task.id)}
          onSelect={onSelectTask}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDeleteTask}
        />
      ))}
    </section>
  );
}
