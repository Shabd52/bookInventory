import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, BookOpen } from 'lucide-react';

const DEFAULT_COVER = 'https://placehold.co/120x160/1e3a5f/ffffff?text=No+Cover';

/**
 * Card-style display for a single book.
 * @param {Object} book - Book document
 * @param {Function} onDelete - Called with the book ID when delete is requested
 */
function BookCard({ book, onDelete }) {
  const availabilityClass =
    book.availability === 'Available' ? 'badge-available' : 'badge-unavailable';

  return (
    <div className="book-card">
      {/* Cover */}
      <div className="book-card__cover">
        <img
          src={book.coverImage || DEFAULT_COVER}
          alt={`${book.title} cover`}
          onError={(e) => { e.target.src = DEFAULT_COVER; }}
        />
        <span className={`book-card__badge ${availabilityClass}`}>
          {book.availability}
        </span>
      </div>

      {/* Info */}
      <div className="book-card__body">
        <h6 className="book-card__title" title={book.title}>
          {book.title}
        </h6>
        <p className="book-card__author">{book.author}</p>
        <div className="book-card__meta">
          <span className="book-card__category">{book.category}</span>
          <span className="book-card__copies">
            <BookOpen size={12} /> {book.availableCopies}/{book.totalCopies}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="book-card__actions">
        <Link to={`/books/${book._id}`} className="btn btn-action btn-view" title="View">
          <Eye size={15} />
        </Link>
        <Link to={`/books/${book._id}/edit`} className="btn btn-action btn-edit" title="Edit">
          <Pencil size={15} />
        </Link>
        <button
          className="btn btn-action btn-delete"
          title="Delete"
          onClick={() => onDelete(book)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default BookCard;
