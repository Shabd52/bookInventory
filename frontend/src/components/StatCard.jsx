/**
 * Reusable dashboard statistic card.
 * @param {string} title - Card label
 * @param {string|number} value - Metric value
 * @param {ReactNode} icon - Lucide icon element
 * @param {string} color - CSS class for accent colour (e.g. 'blue', 'green', 'red', 'purple')
 * @param {string} subtitle - Optional small text below value
 */
function StatCard({ title, value, icon, color = 'blue', subtitle }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__title">{title}</p>
        <h2 className="stat-card__value">{value ?? '—'}</h2>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
