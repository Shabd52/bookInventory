import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Tag,
  Archive,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/books', icon: BookOpen, label: 'All Books' },
  { to: '/books/add', icon: PlusCircle, label: 'Add New Book' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/inventory', icon: Archive, label: 'Inventory' },
];

/**
 * Sidebar navigation component.
 * Accepts `isOpen` and `onClose` props for mobile drawer behaviour.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <BookOpen size={28} className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">BookShelf</span>
          <button className="sidebar-close d-lg-none btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">MAIN MENU</p>
          <ul className="sidebar-nav-list">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon size={18} className="sidebar-nav-icon" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-info">
            <BookOpen size={14} />
            <span>Book Inventory System v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
