import { useEffect, useState } from 'react';
import { TASK_CATEGORIES } from '../utils/constants';
import type { Task, TaskInput } from '../utils/types';

type TaskFormProps = {
  initialTask?: Task;
  onSubmit: (taskInput: TaskInput) => void;
};

type FormState = {
  title: string;
  description: string;
  dueDate: string;
  category: string;
};

function getInitialState(task?: Task): FormState {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: task?.dueDate ?? '',
    category: task?.category ?? TASK_CATEGORIES[0],
  };
}

export function TaskForm({ initialTask, onSubmit }: TaskFormProps) {
  const [formState, setFormState] = useState<FormState>(() => getInitialState(initialTask));
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    setFormState(getInitialState(initialTask));
  }, [initialTask]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));

    if (field === 'title' && value.trim()) {
      setTitleError('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      setTitleError('Title is required.');
      return;
    }

    onSubmit({
      title: formState.title,
      description: formState.description,
      dueDate: formState.dueDate,
      category: formState.category,
    });
  };

  return (
    <form className="task-form card" onSubmit={handleSubmit}>
      <label className="field-group">
        <span className="field-label">Title</span>
        <input
          className={`text-input ${titleError ? 'input-error' : ''}`}
          type="text"
          value={formState.title}
          onChange={(event) => handleChange('title', event.target.value)}
          placeholder="Finish React project"
        />
        {titleError ? <span className="field-error">{titleError}</span> : null}
      </label>

      <label className="field-group">
        <span className="field-label">Description</span>
        <textarea
          className="text-input text-area"
          rows={5}
          value={formState.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Add notes, checklist items, or context"
        />
      </label>

      <div className="form-row">
        <label className="field-group">
          <span className="field-label">Due date</span>
          <input
            className="text-input"
            type="date"
            value={formState.dueDate}
            onChange={(event) => handleChange('dueDate', event.target.value)}
          />
        </label>

        <label className="field-group">
          <span className="field-label">Category</span>
          <select
            className="text-input"
            value={formState.category}
            onChange={(event) => handleChange('category', event.target.value)}
          >
            {TASK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {initialTask ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
