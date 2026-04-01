type StatsCardProps = {
  label: string;
  value: string | number;
  tone?: 'default' | 'accent';
};

export function StatsCard({ label, value, tone = 'default' }: StatsCardProps) {
  return (
    <article className={`stats-card ${tone === 'accent' ? 'stats-card-accent' : ''}`}>
      <p className="stats-value">{value}</p>
      <p className="stats-label">{label}</p>
    </article>
  );
}
