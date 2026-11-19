import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const DEFAULT_COVER = 'https://placehold.co/40x52/1e3a5f/ffffff?text=N/A';

/**
 * Responsive table that lists all books with actions.
 * @param {Array}    books    - Array of book documents
 * @param {Function} onDelete - Called with book object on delete click
 */
function BookTable({ books, onDelete }) {
  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__text">No books found.</p>
        <Link to="/books/add" className="btn btn-primary">
          Add Your First Book
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="book-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title / Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Publisher</th>
            <th>Year</th>
            <th className="text-center">Total</th>
            <th className="text-center">Available</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              {/* Cover */}
              <td>
                <img
                  src={book.coverImage || DEFAULT_COVER}
                  alt={book.title}
                  className="table-cover"
                  onError={(e) => { e.target.src = DEFAULT_COVER; }}
                />
              </td>

              {/* Title & Author */}
              <td>
                <span className="table-title">{book.title}</span>
                <br />
                <span className="table-author">{book.author}</span>
              </td>

              <td className="table-isbn">{book.isbn || '—'}</td>
              <td>
                <span className="category-pill">{book.category}</span>
              </td>
              <td>{book.publisher || '—'}</td>
              <td>{book.publicationYear || '—'}</td>

              <td className="text-center">{book.totalCopies}</td>
              <td className="text-center">{book.availableCopies}</td>

              {/* Status */}
              <td className="text-center">
                <span
                  className={`status-badge ${
                    book.availability === 'Available'
                      ? 'status-available'
                      : 'status-unavailable'
                  }`}
                >
                  {book.availability}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="table-actions">
                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-action btn-view"
                    title="View"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    to={`/books/${book._id}/edit`}
                    className="btn btn-action btn-edit"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    className="btn btn-action btn-delete"
                    title="Delete"
                    onClick={() => onDelete(book)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
