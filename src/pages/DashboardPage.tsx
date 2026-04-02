import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SearchBar } from '../components/SearchBar';
import { SortControls } from '../components/SortControls';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../context/TaskContext';
import { useTaskFilters } from '../hooks/useTaskFilters';
import type { SortOption, Task } from '../utils/types';

export function DashboardPage() {
  const { tasks, deleteTask, deleteSelectedTasks, toggleTaskCompletion } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDeleteTask, setPendingDeleteTask] = useState<Task | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const visibleTasks = useTaskFilters(tasks, searchTerm, selectedCategory, sortBy);
  const selectedVisibleCount = useMemo(
    () => visibleTasks.filter((task) => selectedIds.includes(task.id)).length,
    [visibleTasks, selectedIds],
  );

  const handleSelectTask = (id: string, selected: boolean) => {
    setSelectedIds((current) =>
      selected ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    setPendingDeleteTask(task);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      return;
    }

    setIsBulkDeleteOpen(true);
  };

  const handleConfirmSingleDelete = () => {
    if (!pendingDeleteTask) {
      return;
    }

    deleteTask(pendingDeleteTask.id);
    setSelectedIds((current) => current.filter((id) => id !== pendingDeleteTask.id));
    setPendingDeleteTask(null);
  };

  const handleConfirmBulkDelete = () => {
    deleteSelectedTasks(selectedIds);
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  const bulkSelectionMessage =
    selectedCategory === 'All'
      ? `${visibleTasks.length} task(s) shown. ${selectedVisibleCount} selected manually. Only selected task cards will be deleted.`
      : `${visibleTasks.length} task(s) shown in ${selectedCategory}. ${selectedVisibleCount} selected manually. Only selected task cards will be deleted, not the whole category.`;

  return (
    <>
      <div className="page-stack">
        <section className="hero card">
          <div>
            <p className="eyebrow">Task management</p>
            <h1>Stay on top of every task with a clean workflow.</h1>
            <p className="hero-copy">
              Track deadlines, filter priorities, and review your progress from one
              responsive dashboard.
            </p>
          </div>

          <div className="hero-actions">
            <Link className="primary-button" to="/add">
              Add task
            </Link>
            <Link className="ghost-button" to="/stats">
              View stats
            </Link>
          </div>
        </section>

        <section className="controls-panel card">
          <div className="controls-section">
            <div className="controls-section-copy">
              <p className="eyebrow">Find tasks</p>
              <h2>Search, filter, and sort your list</h2>
            </div>
            <div className="controls-grid">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <FilterBar value={selectedCategory} onChange={setSelectedCategory} />
              <SortControls value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </section>

        <section className="bulk-toolbar card">
          <div className="bulk-toolbar-copy">
            <p className="eyebrow">Selected tasks</p>
            <p>{bulkSelectionMessage}</p>
          </div>
          <button
            className="danger-button"
            type="button"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Delete selected tasks
          </button>
        </section>

        <TaskList
          tasks={visibleTasks}
          selectedIds={selectedIds}
          onSelectTask={handleSelectTask}
          onToggleCompletion={toggleTaskCompletion}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <ConfirmDialog
        open={pendingDeleteTask !== null}
        title={pendingDeleteTask ? `Delete "${pendingDeleteTask.title}"?` : 'Delete task?'}
        message="This task will be removed from your list and cannot be restored from this screen."
        confirmLabel="Delete task"
        onCancel={() => setPendingDeleteTask(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      <ConfirmDialog
        open={isBulkDeleteOpen}
        title={`Delete ${selectedIds.length} selected task(s)?`}
        message={
          selectedCategory === 'All'
            ? 'Only the tasks you selected will be deleted. This will not remove every task in the current list.'
            : `Only the tasks you selected in ${selectedCategory} will be deleted. This will not remove the whole category.`
        }
        confirmLabel="Delete selected tasks"
        onCancel={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
      />
    </>
  );
}
