export type Theme = 'light' | 'dark';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
};

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'completed'> & {
  completed?: boolean;
};

export type SortOption = 'dueDate' | 'completion';

export type TaskStats = {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionPercentage: number;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
};

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  mutedText: string;
  placeholder: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  danger: string;
};
