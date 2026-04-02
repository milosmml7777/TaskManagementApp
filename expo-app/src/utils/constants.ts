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
    background: '#f4f7fb',
    surface: 'rgba(255, 255, 255, 0.9)',
    surfaceStrong: '#e7eef7',
    card: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(15, 23, 42, 0.1)',
    text: '#334155',
    heading: '#0f172a',
    mutedText: '#64748b',
    placeholder: '#64748b',
    accent: '#0f766e',
    accentSoft: 'rgba(15, 118, 110, 0.2)',
    onAccent: '#f8fafc',
    success: '#15803d',
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.12)',
  },
  dark: {
    background: '#0f172a',
    surface: 'rgba(15, 23, 42, 0.9)',
    surfaceStrong: '#162338',
    card: 'rgba(15, 23, 42, 0.9)',
    border: 'rgba(148, 163, 184, 0.18)',
    text: '#cbd5e1',
    heading: '#f8fafc',
    mutedText: '#94a3b8',
    placeholder: '#94a3b8',
    accent: '#2dd4bf',
    accentSoft: 'rgba(45, 212, 191, 0.22)',
    onAccent: '#f8fafc',
    success: '#22c55e',
    danger: '#f87171',
    dangerSoft: 'rgba(248, 113, 113, 0.12)',
  },
};
