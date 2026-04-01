import { Link, useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../context/TaskContext';
import type { TaskInput } from '../utils/types';

export function TaskFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addTask, getTaskById, updateTask } = useTasks();
  const existingTask = id ? getTaskById(id) : undefined;

  const handleSubmit = (taskInput: TaskInput) => {
    if (existingTask && id) {
      updateTask(id, taskInput);
      navigate(`/task/${id}`);
      return;
    }

    addTask(taskInput);
    navigate('/');
  };

  if (id && !existingTask) {
    return (
      <section className="card details-card">
        <h1>Task not found</h1>
        <p>The task you are trying to edit does not exist anymore.</p>
        <Link className="primary-button" to="/">
          Back to dashboard
        </Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">{existingTask ? 'Edit task' : 'Create task'}</p>
        <h1>{existingTask ? 'Update your task' : 'Add a new task'}</h1>
        <p className="hero-copy">
          Keep the form focused so the same business rules can be reused later in
          React Native.
        </p>
      </section>

      <TaskForm initialTask={existingTask} onSubmit={handleSubmit} />
    </div>
  );
}
