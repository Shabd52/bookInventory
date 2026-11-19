import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import BookForm from '../components/BookForm';
import { getBookById, updateBook } from '../services/bookService';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch current book data to pre-populate the form
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBookById(id);
        const book = data.data;
        setBookData({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          category: book.category || 'General',
          publisher: book.publisher || '',
          publicationYear: book.publicationYear || '',
          totalCopies: book.totalCopies ?? 1,
          availableCopies: book.availableCopies ?? 1,
          description: book.description || '',
          coverImage: book.coverImage || '',
        });
      } catch (err) {
        setError('Book not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateBook(id, formData);
      toast.success('Book updated successfully!');
      navigate(`/books/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update book.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading book data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-danger">{error}</div>
        <Link to="/books" className="btn btn-secondary">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/books" className="back-link">
            <ArrowLeft size={16} /> Back to Books
          </Link>
          <h1 className="page-title mt-1">Edit Book</h1>
          <p className="page-subtitle">Update the book information below</p>
        </div>
      </div>

      <div className="form-card">
        <BookForm
          initialData={bookData}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Update Book"
        />
      </div>
    </div>
  );
}

export default EditBook;
