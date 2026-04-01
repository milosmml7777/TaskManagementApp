import type { SortOption, Theme, ThemeColors } from './types';

export const STORAGE_KEYS = {
  tasks: 'task-management-app/native/tasks',
  theme: 'task-management-app/native/theme',
} as const;

export const TASK_CATEGORIES = ['Work', 'Personal', 'Study', 'Other'] as const;

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'completion', label: 'Completion' },
];

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  light: {
    background: '#f5efe6',
    surface: '#efe4d2',
    card: '#fffaf3',
    border: '#dcc7a7',
    text: '#1f1c18',
    mutedText: '#6d6255',
    placeholder: '#918474',
    accent: '#d06224',
    accentSoft: '#f8cfb6',
    onAccent: '#fffaf4',
    success: '#2f7a46',
    danger: '#b43f2b',
  },
  dark: {
    background: '#16181d',
    surface: '#23262d',
    card: '#1d2027',
    border: '#333843',
    text: '#f6efe4',
    mutedText: '#b8b2a8',
    placeholder: '#8e8a84',
    accent: '#ff8f4d',
    accentSoft: '#66381b',
    onAccent: '#17120d',
    success: '#5bc47b',
    danger: '#ff8269',
  },
};
