import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { DashboardPage } from '../pages/DashboardPage';
import { StatsPage } from '../pages/StatsPage';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { TaskFormPage } from '../pages/TaskFormPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <Link className="brand" to="/">
            TaskFlow
          </Link>

          <nav className="topnav">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/add">Add Task</NavLink>
            <NavLink to="/stats">Stats</NavLink>
          </nav>

          <ThemeToggle />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add" element={<TaskFormPage />} />
            <Route path="/edit/:id" element={<TaskFormPage />} />
            <Route path="/task/:id" element={<TaskDetailsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
