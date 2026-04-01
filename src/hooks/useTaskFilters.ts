import type { SortOption, Task } from '../utils/types';

export function useTaskFilters(
  tasks: Task[],
  searchTerm: string,
  selectedCategory: string,
  sortBy: SortOption,
) {
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'All' || task.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return [...filteredTasks].sort((left, right) => {
    if (sortBy === 'completion') {
      if (left.completed === right.completed) {
        return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
      }

      return Number(left.completed) - Number(right.completed);
    }

    const leftDue = left.dueDate ? new Date(left.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    const rightDue = right.dueDate ? new Date(right.dueDate).getTime() : Number.MAX_SAFE_INTEGER;

    return leftDue - rightDue;
  });
}
