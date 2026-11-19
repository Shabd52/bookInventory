const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

// GET /api/books         → list all books (supports ?search=&category=&availability=)
// POST /api/books        → create a new book
router.route('/').get(getBooks).post(createBook);

// GET /api/books/:id     → get a specific book
// PUT /api/books/:id     → update a book
// DELETE /api/books/:id  → delete a book
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;
