import { Filter, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Computer Science',
  'Database Management',
  'Web Development',
  'Artificial Intelligence',
  'Mathematics',
  'Fiction',
  'Science',
  'History',
  'General',
];

const AVAILABILITY = ['All', 'Available', 'Unavailable'];

/**
 * Filter panel for category and availability filters.
 * @param {Object}   filters   - { category, availability }
 * @param {Function} onChange  - Called with updated filters object
 * @param {Function} onClear   - Resets all filters
 */
function FilterPanel({ filters, onChange, onClear }) {
  const hasActiveFilter =
    filters.category !== 'All' || filters.availability !== 'All';

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__header">
        <Filter size={15} />
        <span>Filters</span>
        {hasActiveFilter && (
          <button className="filter-panel__clear btn" onClick={onClear}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      <div className="filter-panel__controls">
        {/* Category */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="form-select form-select-sm"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div className="filter-group">
          <label className="filter-label">Availability</label>
          <select
            className="form-select form-select-sm"
            value={filters.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
          >
            {AVAILABILITY.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
