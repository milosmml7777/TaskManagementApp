import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { SearchBar } from '../components/SearchBar';
import { SortControls } from '../components/SortControls';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../context/TaskContext';
import { useTaskFilters } from '../hooks/useTaskFilters';
import type { SortOption } from '../utils/types';

export function DashboardPage() {
  const { tasks, deleteTask, deleteSelectedTasks, toggleTaskCompletion } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

    const confirmed = window.confirm(`Delete "${task.title}"?`);

    if (confirmed) {
      deleteTask(id);
      setSelectedIds((current) => current.filter((item) => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected task(s)?`);

    if (confirmed) {
      deleteSelectedTasks(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
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
        <div className="controls-grid">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterBar value={selectedCategory} onChange={setSelectedCategory} />
          <SortControls value={sortBy} onChange={setSortBy} />
        </div>
        <div></div>
        <div className="bulk-toolbar">
          <p>
            {visibleTasks.length} task(s) shown, {selectedVisibleCount} selected
          </p>
          <button
            className="danger-button"
            type="button"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Delete selected
          </button>
        </div>
      </section>

      <TaskList
        tasks={visibleTasks}
        selectedIds={selectedIds}
        onSelectTask={handleSelectTask}
        onToggleCompletion={toggleTaskCompletion}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
