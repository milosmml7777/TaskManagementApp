import { useEffect, useRef, useState } from 'react';
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
    title: (task?.title ?? '').slice(0, 30),
    description: task?.description ?? '',
    dueDate: task?.dueDate ?? '',
    category: task?.category ?? TASK_CATEGORIES[0],
  };
}

export function TaskForm({ initialTask, onSubmit }: TaskFormProps) {
  const [formState, setFormState] = useState<FormState>(() => getInitialState(initialTask));
  const [titleError, setTitleError] = useState('');
  const [titleLimitFeedback, setTitleLimitFeedback] = useState(false);
  const titleLimitTimeoutRef = useRef<number | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormState(getInitialState(initialTask));
  }, [initialTask]);

  useEffect(() => {
    return () => {
      if (titleLimitTimeoutRef.current !== null) {
        window.clearTimeout(titleLimitTimeoutRef.current);
      }
    };
  }, []);

  const triggerTitleLimitFeedback = () => {
    if (titleLimitTimeoutRef.current !== null) {
      window.clearTimeout(titleLimitTimeoutRef.current);
    }

    setTitleLimitFeedback(true);

    titleInputRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-7px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      {
        duration: 420,
        easing: 'ease',
      },
    );

    titleLimitTimeoutRef.current = window.setTimeout(() => {
      setTitleLimitFeedback(false);
    }, 550);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const normalizedValue = field === 'title' ? value.slice(0, 30) : value;
    setFormState((current) => ({ ...current, [field]: normalizedValue }));

    if (field === 'title' && normalizedValue.trim()) {
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
        <span className="field-row">
          <span className="field-label">Title</span>
          <span className={`field-helper ${titleLimitFeedback ? 'limit-feedback-helper' : ''}`}>
            {formState.title.length}/30
          </span>
        </span>
        <input
          ref={titleInputRef}
          className={`text-input ${titleError ? 'input-error' : ''} ${
            titleLimitFeedback ? 'limit-feedback-input' : ''
          }`}
          type="text"
          maxLength={30}
          value={formState.title}
          onChange={(event) => handleChange('title', event.target.value)}
          onKeyDown={(event) => {
            const isCharacterKey =
              event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

            if (formState.title.length >= 30 && isCharacterKey) {
              triggerTitleLimitFeedback();
            }
          }}
          onPaste={(event) => {
            const pastedText = event.clipboardData.getData('text');

            if (formState.title.length + pastedText.length > 30) {
              triggerTitleLimitFeedback();
            }
          }}
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
