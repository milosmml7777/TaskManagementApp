import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { STORAGE_KEYS } from '../utils/constants';
import { createTask } from '../utils/taskHelpers';
import type { Task, TaskInput } from '../utils/types';

type TaskContextValue = {
  tasks: Task[];
  addTask: (taskInput: TaskInput) => void;
  updateTask: (id: string, updates: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
  deleteSelectedTasks: (ids: string[]) => void;
  toggleTaskCompletion: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = usePersistentState<Task[]>(STORAGE_KEYS.tasks, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      addTask: (taskInput) => {
        setTasks((current) => [createTask(taskInput), ...current]);
      },
      updateTask: (id, updates) => {
        setTasks((current) =>
          current.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  title: updates.title?.trim() ?? task.title,
                  description: updates.description?.trim() ?? task.description,
                }
              : task,
          ),
        );
      },
      deleteTask: (id) => {
        setTasks((current) => current.filter((task) => task.id !== id));
      },
      deleteSelectedTasks: (ids) => {
        const selectedIds = new Set(ids);
        setTasks((current) => current.filter((task) => !selectedIds.has(task.id)));
      },
      toggleTaskCompletion: (id) => {
        setTasks((current) =>
          current.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        );
      },
      getTaskById: (id) => tasks.find((task) => task.id === id),
    }),
    [tasks, setTasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
}
