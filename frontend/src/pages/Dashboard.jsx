import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Tag,
  PlusCircle,
  Clock,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/dashboardService';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CHART_COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

const DEFAULT_COVER = 'https://placehold.co/40x52/1e3a5f/ffffff?text=N/A';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await getDashboardStats();
      setStats(data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard statistics. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // ── Chart data ────────────────────────────────────────────────────────
  const categoryLabels = stats.categoryDistribution.map((c) => c.category);
  const categoryCounts = stats.categoryDistribution.map((c) => c.count);

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: CHART_COLORS,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Total Copies',
        data: stats.categoryDistribution.map((c) => c.totalCopies),
        backgroundColor: '#4f46e5aa',
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Available Copies',
        data: stats.categoryDistribution.map((c) => c.availableCopies),
        backgroundColor: '#10b981aa',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your book inventory</p>
        </div>
        <Link to="/books/add" className="btn btn-primary">
          <PlusCircle size={16} className="me-2" />
          Add New Book
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<BookOpen size={22} />}
          color="blue"
          subtitle={`${stats.totalCopies} total copies`}
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          icon={<CheckCircle size={22} />}
          color="green"
          subtitle={`${stats.totalAvailableCopies} copies available`}
        />
        <StatCard
          title="Unavailable Books"
          value={stats.unavailableBooks}
          icon={<XCircle size={22} />}
          color="red"
          subtitle="Out of stock"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<Tag size={22} />}
          color="purple"
          subtitle="Distinct categories"
        />
      </div>

      {/* Charts + Recent Books */}
      <div className="dashboard-charts">
        {/* Doughnut */}
        <div className="chart-card">
          <h2 className="chart-card__title">Books by Category</h2>
          <div className="chart-card__body">
            {stats.totalBooks === 0 ? (
              <p className="text-muted text-center">No data yet</p>
            ) : (
              <Doughnut data={doughnutData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Bar */}
        <div className="chart-card chart-card--wide">
          <h2 className="chart-card__title">Inventory by Category</h2>
          <div className="chart-card__body">
            {stats.totalBooks === 0 ? (
              <p className="text-muted text-center">No data yet</p>
            ) : (
              <Bar data={barData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <div className="recent-books-card">
        <div className="recent-books-card__header">
          <div className="d-flex align-items-center gap-2">
            <Clock size={18} />
            <h2 className="chart-card__title mb-0">Recently Added Books</h2>
          </div>
          <Link to="/books" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>

        {stats.recentBooks.length === 0 ? (
          <p className="text-muted p-3">No books in inventory yet.</p>
        ) : (
          <ul className="recent-books-list">
            {stats.recentBooks.map((book) => (
              <li key={book._id} className="recent-book-item">
                <img
                  src={book.coverImage || DEFAULT_COVER}
                  alt={book.title}
                  className="recent-book-cover"
                  onError={(e) => { e.target.src = DEFAULT_COVER; }}
                />
                <div className="recent-book-info">
                  <Link to={`/books/${book._id}`} className="recent-book-title">
                    {book.title}
                  </Link>
                  <span className="recent-book-category">{book.category}</span>
                </div>
                <span
                  className={`status-badge ms-auto ${
                    book.availability === 'Available'
                      ? 'status-available'
                      : 'status-unavailable'
                  }`}
                >
                  {book.availability}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
