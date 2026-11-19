import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookTable from '../components/BookTable';
import BookCard from '../components/BookCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { getBooks, deleteBook } from '../services/bookService';

const DEFAULT_FILTERS = { category: 'All', availability: 'All' };

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Search & filter state — initialised from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Delete confirmation state
  const [confirmBook, setConfirmBook] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.availability !== 'All') params.availability = filters.availability;

      const { data } = await getBooks(params);
      setBooks(data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch books. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  // Clear URL search param after first load
  useEffect(() => {
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search'));
      setSearchParams({});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmBook) return;
    try {
      setDeleting(true);
      await deleteBook(confirmBook._id);
      toast.success(`"${confirmBook.title}" deleted successfully`);
      setConfirmBook(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Books</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${books.length} book${books.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Link to="/books/add" className="btn btn-primary">
          <PlusCircle size={16} className="me-2" />
          Add New Book
        </Link>
      </div>

      {/* Controls Row */}
      <div className="books-controls">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search by title, author or ISBN..."
        />
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
        />
        <div className="view-toggle ms-auto">
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('table')}
            title="Table view"
          >
            <List size={15} />
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <div className="page-loading">
          <div className="spinner-border text-primary" />
          <p>Loading books...</p>
        </div>
      ) : viewMode === 'table' ? (
        <BookTable books={books} onDelete={setConfirmBook} />
      ) : (
        <div className="books-grid">
          {books.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No books found.</p>
              <Link to="/books/add" className="btn btn-primary">
                Add Your First Book
              </Link>
            </div>
          ) : (
            books.map((book) => (
              <BookCard key={book._id} book={book} onDelete={setConfirmBook} />
            ))
          )}
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        show={!!confirmBook}
        title="Delete Book"
        message={`Are you sure you want to delete "${confirmBook?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmBook(null)}
        isLoading={deleting}
      />
    </div>
  );
}

export default Books;
