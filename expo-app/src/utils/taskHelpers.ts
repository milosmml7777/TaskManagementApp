import { TASK_CATEGORIES } from './constants';
import type { Task, TaskInput, TaskStats } from './types';

export function createTask(taskInput: TaskInput): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    title: taskInput.title.trim(),
    description: taskInput.description.trim(),
    dueDate: taskInput.dueDate,
    category: taskInput.category,
    completed: taskInput.completed ?? false,
    createdAt: new Date().toISOString(),
  };
}

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(task.dueDate) < today;
}

export function formatDate(value: string): string {
  if (!value) {
    return 'Not set';
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(isTaskOverdue).length;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoryDistribution = TASK_CATEGORIES.map((category) => {
    const count = tasks.filter((task) => task.category === category).length;

    return {
      category,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  }).filter((item) => item.count > 0);

  return {
    total,
    completed,
    active,
    overdue,
    completionPercentage,
    categoryDistribution,
  };
}
