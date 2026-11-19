import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Programming',
  'Computer Science',
  'Database Management',
  'Web Development',
  'Artificial Intelligence',
  'Mathematics',
  'Fiction',
  'Science',
  'History',
  'General',
];

const CURRENT_YEAR = new Date().getFullYear();

const initialState = {
  title: '',
  author: '',
  isbn: '',
  category: 'General',
  publisher: '',
  publicationYear: '',
  totalCopies: 1,
  availableCopies: 1,
  description: '',
  coverImage: '',
};

/**
 * Reusable controlled form for adding and editing books.
 * @param {Object}   initialData  - Prepopulated values when editing
 * @param {Function} onSubmit     - Called with form data on successful validation
 * @param {boolean}  isLoading    - Disables submit while API call is in progress
 * @param {string}   submitLabel  - Button label text
 */
function BookForm({ initialData = {}, onSubmit, isLoading = false, submitLabel = 'Save Book' }) {
  const [form, setForm] = useState({ ...initialState, ...initialData });
  const [errors, setErrors] = useState({});

  // Keep form in sync when initialData changes (edit page)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setForm({ ...initialState, ...initialData });
    }
  }, [initialData?.title]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (!form.title.trim()) errs.title = 'Book title is required';
    if (!form.author.trim()) errs.author = 'Author name is required';

    const year = Number(form.publicationYear);
    if (form.publicationYear && (isNaN(year) || year < 1000 || year > CURRENT_YEAR + 1)) {
      errs.publicationYear = `Year must be between 1000 and ${CURRENT_YEAR + 1}`;
    }

    const total = Number(form.totalCopies);
    const available = Number(form.availableCopies);

    if (isNaN(total) || total < 0) errs.totalCopies = 'Must be a non-negative number';
    if (isNaN(available) || available < 0) errs.availableCopies = 'Must be a non-negative number';
    if (!errs.totalCopies && !errs.availableCopies && available > total) {
      errs.availableCopies = 'Available copies cannot exceed total copies';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...form,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
      publicationYear: form.publicationYear ? Number(form.publicationYear) : null,
      isbn: form.isbn.trim() || null,
    });
  };

  // ── Helper ───────────────────────────────────────────────────────────────
  const fieldClass = (name) =>
    `form-control ${errors[name] ? 'is-invalid' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {/* Title */}
        <div className="col-md-6">
          <label className="form-label">
            Book Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            className={fieldClass('title')}
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Clean Code"
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        {/* Author */}
        <div className="col-md-6">
          <label className="form-label">
            Author Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="author"
            className={fieldClass('author')}
            value={form.author}
            onChange={handleChange}
            placeholder="e.g. Robert C. Martin"
          />
          {errors.author && <div className="invalid-feedback">{errors.author}</div>}
        </div>

        {/* ISBN */}
        <div className="col-md-4">
          <label className="form-label">ISBN Number</label>
          <input
            type="text"
            name="isbn"
            className={fieldClass('isbn')}
            value={form.isbn}
            onChange={handleChange}
            placeholder="e.g. 9780132350884"
          />
          {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
        </div>

        {/* Category */}
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <select
            name="category"
            className={fieldClass('category')}
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Publisher */}
        <div className="col-md-4">
          <label className="form-label">Publisher</label>
          <input
            type="text"
            name="publisher"
            className="form-control"
            value={form.publisher}
            onChange={handleChange}
            placeholder="e.g. Prentice Hall"
          />
        </div>

        {/* Publication Year */}
        <div className="col-md-4">
          <label className="form-label">Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            className={fieldClass('publicationYear')}
            value={form.publicationYear}
            onChange={handleChange}
            placeholder={`e.g. ${CURRENT_YEAR}`}
            min="1000"
            max={CURRENT_YEAR + 1}
          />
          {errors.publicationYear && (
            <div className="invalid-feedback">{errors.publicationYear}</div>
          )}
        </div>

        {/* Total Copies */}
        <div className="col-md-4">
          <label className="form-label">
            Total Copies <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="totalCopies"
            className={fieldClass('totalCopies')}
            value={form.totalCopies}
            onChange={handleChange}
            min="0"
          />
          {errors.totalCopies && (
            <div className="invalid-feedback">{errors.totalCopies}</div>
          )}
        </div>

        {/* Available Copies */}
        <div className="col-md-4">
          <label className="form-label">
            Available Copies <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="availableCopies"
            className={fieldClass('availableCopies')}
            value={form.availableCopies}
            onChange={handleChange}
            min="0"
            max={form.totalCopies}
          />
          {errors.availableCopies && (
            <div className="invalid-feedback">{errors.availableCopies}</div>
          )}
        </div>

        {/* Cover Image URL */}
        <div className="col-12">
          <label className="form-label">Book Cover Image URL (optional)</label>
          <input
            type="url"
            name="coverImage"
            className="form-control"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
          />
          {form.coverImage && (
            <div className="mt-2">
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="cover-preview"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="col-12">
          <label className="form-label">Book Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="A short description of the book..."
          />
        </div>

        {/* Inventory note */}
        {Number(form.availableCopies) > Number(form.totalCopies) && (
          <div className="col-12">
            <div className="alert alert-warning d-flex align-items-center gap-2 py-2">
              <AlertCircle size={16} />
              Available copies cannot exceed total copies
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BookForm;
