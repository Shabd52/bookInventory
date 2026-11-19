import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, BookOpen, Calendar, Hash, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { getBookById, deleteBook } from '../services/bookService';

const DEFAULT_COVER = 'https://placehold.co/200x270/1e3a5f/ffffff?text=No+Cover';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBookById(id);
        setBook(data.data);
      } catch (err) {
        setError('Book not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBook(id);
      toast.success('Book deleted successfully');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page">
        <div className="alert alert-danger">{error || 'Book not found'}</div>
        <Link to="/books" className="btn btn-secondary">
          Back to Books
        </Link>
      </div>
    );
  }

  const availabilityColor = book.availability === 'Available' ? 'status-available' : 'status-unavailable';

  return (
    <div className="page">
      {/* Back link */}
      <Link to="/books" className="back-link mb-3 d-inline-flex">
        <ArrowLeft size={16} /> Back to Books
      </Link>

      <div className="book-details-card">
        {/* Cover */}
        <div className="book-details-cover">
          <img
            src={book.coverImage || DEFAULT_COVER}
            alt={`${book.title} cover`}
            onError={(e) => { e.target.src = DEFAULT_COVER; }}
          />
          <span className={`status-badge mt-3 ${availabilityColor}`}>
            {book.availability}
          </span>
        </div>

        {/* Info */}
        <div className="book-details-info">
          <div className="book-details-header">
            <div>
              <span className="category-pill mb-2">{book.category}</span>
              <h1 className="book-details-title">{book.title}</h1>
              <p className="book-details-author">by {book.author}</p>
            </div>
            <div className="book-details-actions">
              <Link to={`/books/${id}/edit`} className="btn btn-primary">
                <Pencil size={15} className="me-1" /> Edit
              </Link>
              <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
                <Trash2 size={15} className="me-1" /> Delete
              </button>
            </div>
          </div>

          {/* Meta grid */}
          <div className="book-details-meta">
            <div className="meta-item">
              <Hash size={16} />
              <div>
                <p className="meta-label">ISBN</p>
                <p className="meta-value">{book.isbn || 'N/A'}</p>
              </div>
            </div>
            <div className="meta-item">
              <Building2 size={16} />
              <div>
                <p className="meta-label">Publisher</p>
                <p className="meta-value">{book.publisher || 'N/A'}</p>
              </div>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <div>
                <p className="meta-label">Publication Year</p>
                <p className="meta-value">{book.publicationYear || 'N/A'}</p>
              </div>
            </div>
            <div className="meta-item">
              <BookOpen size={16} />
              <div>
                <p className="meta-label">Copies</p>
                <p className="meta-value">
                  {book.availableCopies} available / {book.totalCopies} total
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="book-details-description">
              <h3 className="description-title">About This Book</h3>
              <p>{book.description}</p>
            </div>
          )}

          {/* Inventory bar */}
          <div className="inventory-bar-wrapper">
            <div className="d-flex justify-content-between mb-1">
              <small>Availability</small>
              <small>{book.availableCopies}/{book.totalCopies} copies</small>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-success"
                style={{
                  width: book.totalCopies
                    ? `${(book.availableCopies / book.totalCopies) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>

          {/* Added date */}
          <p className="book-details-date">
            Added on {new Date(book.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        show={showConfirm}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        isLoading={deleting}
      />
    </div>
  );
}

export default BookDetails;
