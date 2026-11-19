import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, Bell, User } from 'lucide-react';

/**
 * Top navigation bar with global search, hamburger menu (mobile), and user section.
 * @param {Function} onMenuToggle - Callback to open/close the sidebar on mobile
 */
function Navbar({ onMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="navbar-top">
      {/* Hamburger — mobile only */}
      <button className="navbar-menu-btn d-lg-none btn" onClick={onMenuToggle}>
        <Menu size={22} />
      </button>

      {/* App name — mobile only */}
      <span className="navbar-brand-mobile d-lg-none">BookShelf</span>

      {/* Global search */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <Search size={16} className="navbar-search-icon" />
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search books, authors, ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Right section */}
      <div className="navbar-right">
        <button className="navbar-icon-btn btn" title="Notifications">
          <Bell size={18} />
          <span className="navbar-badge">3</span>
        </button>
        <div className="navbar-user">
          <div className="navbar-avatar">
            <User size={16} />
          </div>
          <span className="navbar-username d-none d-md-inline">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
