export type Theme = 'light' | 'dark';
//important note: this is a type that looks like an object
//dictates task details
export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
};
//Omit means its a new copy Type as the old one but without the keys Omit<Type, Keys> where 'Keys' are a union property '|'
//here it strips 'id' | 'createdAt' | 'completed from the old type and redefines the boolean completed to be optional instead of required
export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'completed'> & {
  completed?: boolean;
};
//set sort options to either 'dueDate' |or'completion'
export type SortOption = 'dueDate' | 'completion';
//dictates statistics of a given task
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
//types exist during complie time only, im using them as a form of validation (it doesn't store value, rather dictates them)