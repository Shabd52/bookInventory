import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import BookForm from '../components/BookForm';
import { createBook } from '../services/bookService';

function AddBook() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await createBook(formData);
      toast.success('Book added successfully!');
      navigate('/books');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add book. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/books" className="back-link">
            <ArrowLeft size={16} /> Back to Books
          </Link>
          <h1 className="page-title mt-1">Add New Book</h1>
          <p className="page-subtitle">Fill in the details to add a book to the inventory</p>
        </div>
      </div>

      <div className="form-card">
        <BookForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Add Book"
        />
      </div>
    </div>
  );
}

export default AddBook;
