import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { useTasks } from '../context/TaskContext';
import { getTaskStats } from '../utils/taskHelpers';

export function StatsPage() {
  const { tasks } = useTasks();
  const stats = getTaskStats(tasks);

  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">Task insights</p>
        <h1>See how your workload is trending.</h1>
        <p className="hero-copy">
          These stats are calculated from the same task model used across the app.
        </p>
      </section>

      <section className="stats-grid">
        <StatsCard label="Total tasks" value={stats.total} tone="accent" />
        <StatsCard label="Completed" value={stats.completed} />
        <StatsCard label="Active" value={stats.active} />
        <StatsCard label="Overdue" value={stats.overdue} />
        <StatsCard label="Completion rate" value={`${stats.completionPercentage}%`} />
      </section>

      <section className="card distribution-card">
        <div className="section-title-row">
          <h2>Category distribution</h2>
          <Link className="ghost-button" to="/">
            Back to dashboard
          </Link>
        </div>

        {stats.categoryDistribution.length === 0 ? (
          <p className="empty-copy">Add tasks to see category distribution.</p>
        ) : (
          <div className="distribution-list">
            {stats.categoryDistribution.map((item) => (
              <div key={item.category} className="distribution-item">
                <div className="distribution-meta">
                  <span>{item.category}</span>
                  <span>
                    {item.count} task(s) • {item.percentage}%
                  </span>
                </div>
                <div className="distribution-bar">
                  <span style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
