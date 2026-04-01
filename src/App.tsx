import './App.css';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppRouter />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
