import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Book Service ──────────────────────────────────────────────────────────

/**
 * Fetch all books with optional search/filter query params.
 * @param {Object} params - { search, category, availability, publicationYear }
 */
export const getBooks = (params = {}) => api.get('/books', { params });

/**
 * Fetch a single book by ID.
 */
export const getBookById = (id) => api.get(`/books/${id}`);

/**
 * Create a new book.
 * @param {Object} bookData - Book form data
 */
export const createBook = (bookData) => api.post('/books', bookData);

/**
 * Update an existing book.
 * @param {string} id - Book ID
 * @param {Object} bookData - Updated fields
 */
export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);

/**
 * Delete a book by ID.
 */
export const deleteBook = (id) => api.delete(`/books/${id}`);

export default api;
