import { Search, X } from 'lucide-react';

/**
 * Search bar component.
 * @param {string}   value       - Current search query
 * @param {Function} onChange    - Called when input changes
 * @param {Function} onClear     - Called when clear button is clicked
 * @param {string}   placeholder - Input placeholder text
 */
function SearchBar({ value, onChange, onClear, placeholder = 'Search books...' }) {
  return (
    <div className="search-bar">
      <Search size={16} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-bar__clear btn" onClick={onClear} title="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
