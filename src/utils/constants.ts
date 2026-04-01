import type { SortOption } from './types';
//as const exact strings so they are readonly, this is an object. (as const is typescript only so it gets removed during compilation)
export const STORAGE_KEYS = {
  tasks: 'task-management-app/tasks',
  theme: 'task-management-app/theme',
} as const;
//as const so they are explictly 'Work', 'Personal', 'Study', 'Other', and not string[] (not empty string, but array of ANY strings)
export const TASK_CATEGORIES = ['Work', 'Personal', 'Study', 'Other'] as const;
//array but explicit SortOption forced so it doesnt allow random values to be added
//also translating 'dueDate' to 'Due date' for users to read and 'completion as Completion'
export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'completion', label: 'Completion' },
];
