import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, BookOpen } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';

const CHART_COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getDashboardStats();
        setCategories(data.data.categoryDistribution);
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} distinct categories in inventory</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__text">No categories found. Add some books first.</p>
          <Link to="/books/add" className="btn btn-primary">
            Add a Book
          </Link>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div key={cat.category} className="category-card">
              <div
                className="category-card__icon"
                style={{ background: CHART_COLORS[idx % CHART_COLORS.length] + '22',
                         color: CHART_COLORS[idx % CHART_COLORS.length] }}
              >
                <Tag size={22} />
              </div>
              <div className="category-card__body">
                <h3 className="category-card__name">{cat.category}</h3>
                <p className="category-card__count">
                  <BookOpen size={14} /> {cat.count} book{cat.count !== 1 ? 's' : ''}
                </p>
                {/* Progress bar relative to largest category */}
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(cat.count / maxCount) * 100}%`,
                      background: CHART_COLORS[idx % CHART_COLORS.length],
                    }}
                  />
                </div>
                <div className="category-card__copies">
                  <span>{cat.availableCopies} available</span>
                  <span>{cat.totalCopies} total</span>
                </div>
              </div>
              <Link
                to={`/books?category=${encodeURIComponent(cat.category)}`}
                className="btn btn-sm btn-outline-primary category-card__link"
                // categories page passes through the filter via query string; Books page will pick it up
                onClick={() => {
                  // No JS navigation needed — handled by router
                }}
              >
                View Books
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
