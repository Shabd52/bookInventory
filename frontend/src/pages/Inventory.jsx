import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBooks, updateBook } from '../services/bookService';

const DEFAULT_COVER = 'https://placehold.co/40x52/1e3a5f/ffffff?text=N/A';

/**
 * Inline editable row for inventory quantities.
 */
function InventoryRow({ book, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [total, setTotal] = useState(book.totalCopies);
  const [available, setAvailable] = useState(book.availableCopies);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSave = async () => {
    const t = Number(total);
    const a = Number(available);
    if (a > t) {
      setLocalError('Available cannot exceed total');
      return;
    }
    if (t < 0 || a < 0) {
      setLocalError('Values cannot be negative');
      return;
    }
    try {
      setSaving(true);
      await updateBook(book._id, { totalCopies: t, availableCopies: a });
      toast.success(`"${book.title}" inventory updated`);
      setEditing(false);
      setLocalError('');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTotal(book.totalCopies);
    setAvailable(book.availableCopies);
    setLocalError('');
    setEditing(false);
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={book.coverImage || DEFAULT_COVER}
            alt={book.title}
            className="table-cover"
            onError={(e) => { e.target.src = DEFAULT_COVER; }}
          />
          <div>
            <Link to={`/books/${book._id}`} className="table-title">
              {book.title}
            </Link>
            <br />
            <span className="table-author">{book.author}</span>
          </div>
        </div>
      </td>
      <td>
        <span className="category-pill">{book.category}</span>
      </td>

      {/* Total Copies */}
      <td>
        {editing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: '80px' }}
            value={total}
            min="0"
            onChange={(e) => { setTotal(e.target.value); setLocalError(''); }}
          />
        ) : (
          book.totalCopies
        )}
      </td>

      {/* Available Copies */}
      <td>
        {editing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: '80px' }}
            value={available}
            min="0"
            max={total}
            onChange={(e) => { setAvailable(e.target.value); setLocalError(''); }}
          />
        ) : (
          book.availableCopies
        )}
      </td>

      <td>
        <span
          className={`status-badge ${
            book.availability === 'Available' ? 'status-available' : 'status-unavailable'
          }`}
        >
          {book.availability}
        </span>
      </td>

      <td>
        <div className="progress" style={{ height: '6px', width: '80px' }}>
          <div
            className="progress-bar bg-success"
            style={{
              width: book.totalCopies
                ? `${(book.availableCopies / book.totalCopies) * 100}%`
                : '0%',
            }}
          />
        </div>
      </td>

      {/* Actions */}
      <td>
        {editing ? (
          <div>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-success"
                onClick={handleSave}
                disabled={saving}
                title="Save"
              >
                {saving ? <span className="spinner-border spinner-border-sm" /> : <Check size={14} />}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={handleCancel} title="Cancel">
                <X size={14} />
              </button>
            </div>
            {localError && <small className="text-danger">{localError}</small>}
          </div>
        ) : (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setEditing(true)}
            title="Edit quantities"
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </td>
    </tr>
  );
}

function Inventory() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await getBooks();
      setBooks(data.data);
    } catch (err) {
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">
            Manage copy counts for all {books.length} books
          </p>
        </div>
        <Link to="/books/add" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__text">No books in inventory.</p>
          <Link to="/books/add" className="btn btn-primary">
            Add a Book
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="book-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Status</th>
                <th>Fill Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <InventoryRow key={book._id} book={book} onUpdate={fetchBooks} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Inventory;
