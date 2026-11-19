const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// ─── Helper ────────────────────────────────────────────────────────────────
/**
 * Build a Mongoose query filter object from request query parameters.
 * Supports: search (title/author/isbn), category, availability, publicationYear
 */
const buildFilter = (query) => {
  const filter = {};

  // Full-text search across title, author, and ISBN
  if (query.search && query.search.trim()) {
    const regex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ title: regex }, { author: regex }, { isbn: regex }];
  }

  if (query.category && query.category !== 'All') {
    filter.category = query.category;
  }

  if (query.availability && query.availability !== 'All') {
    filter.availability = query.availability;
  }

  if (query.publicationYear) {
    filter.publicationYear = Number(query.publicationYear);
  }

  return filter;
};

// ─── GET /api/books ────────────────────────────────────────────────────────
/**
 * @desc    Retrieve all books with optional search & filter
 * @route   GET /api/books
 * @access  Public
 */
const getBooks = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);

  const books = await Book.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

// ─── GET /api/books/:id ────────────────────────────────────────────────────
/**
 * @desc    Retrieve a single book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// ─── POST /api/books ───────────────────────────────────────────────────────
/**
 * @desc    Add a new book to the inventory
 * @route   POST /api/books
 * @access  Public
 */
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    isbn,
    category,
    publisher,
    publicationYear,
    totalCopies,
    availableCopies,
    description,
    coverImage,
  } = req.body;

  // Manual validations on top of Mongoose schema validations
  if (!title || !title.trim()) {
    res.status(400);
    throw new Error('Book title is required');
  }

  if (!author || !author.trim()) {
    res.status(400);
    throw new Error('Author name is required');
  }

  const parsedTotal = Number(totalCopies);
  const parsedAvailable = Number(availableCopies);

  if (parsedTotal < 0 || parsedAvailable < 0) {
    res.status(400);
    throw new Error('Copy counts cannot be negative');
  }

  if (parsedAvailable > parsedTotal) {
    res.status(400);
    throw new Error('Available copies cannot exceed total copies');
  }

  const bookData = {
    title: title.trim(),
    author: author.trim(),
    isbn: isbn && isbn.trim() ? isbn.trim() : null,
    category: category ? category.trim() : 'General',
    publisher: publisher ? publisher.trim() : '',
    publicationYear: publicationYear ? Number(publicationYear) : null,
    totalCopies: parsedTotal,
    availableCopies: parsedAvailable,
    description: description ? description.trim() : '',
    coverImage: coverImage ? coverImage.trim() : '',
  };

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    message: 'Book added successfully',
    data: book,
  });
});

// ─── PUT /api/books/:id ────────────────────────────────────────────────────
/**
 * @desc    Update book details
 * @route   PUT /api/books/:id
 * @access  Public
 */
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const {
    title,
    author,
    isbn,
    category,
    publisher,
    publicationYear,
    totalCopies,
    availableCopies,
    description,
    coverImage,
  } = req.body;

  // Validate inventory quantities if provided
  const newTotal =
    totalCopies !== undefined ? Number(totalCopies) : book.totalCopies;
  const newAvailable =
    availableCopies !== undefined ? Number(availableCopies) : book.availableCopies;

  if (newTotal < 0 || newAvailable < 0) {
    res.status(400);
    throw new Error('Copy counts cannot be negative');
  }

  if (newAvailable > newTotal) {
    res.status(400);
    throw new Error('Available copies cannot exceed total copies');
  }

  // Build update object
  const updateData = {
    title: title ? title.trim() : book.title,
    author: author ? author.trim() : book.author,
    isbn: isbn !== undefined ? (isbn && isbn.trim() ? isbn.trim() : null) : book.isbn,
    category: category ? category.trim() : book.category,
    publisher: publisher !== undefined ? publisher.trim() : book.publisher,
    publicationYear:
      publicationYear !== undefined ? Number(publicationYear) || null : book.publicationYear,
    totalCopies: newTotal,
    availableCopies: newAvailable,
    description: description !== undefined ? description.trim() : book.description,
    coverImage: coverImage !== undefined ? coverImage.trim() : book.coverImage,
    availability: newAvailable > 0 ? 'Available' : 'Unavailable',
  };

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: updatedBook,
  });
});

// ─── DELETE /api/books/:id ─────────────────────────────────────────────────
/**
 * @desc    Delete a book by ID
 * @route   DELETE /api/books/:id
 * @access  Public
 */
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `Book "${book.title}" deleted successfully`,
    data: { id: req.params.id },
  });
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
