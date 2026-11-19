const mongoose = require('mongoose');

/**
 * Book Schema - represents a book in the inventory.
 * Includes validation, indexes, and automatic timestamp management.
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [150, 'Author name cannot exceed 150 characters'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true, // allows multiple documents without an ISBN (null values)
      trim: true,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    publisher: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Publisher name cannot exceed 150 characters'],
    },
    publicationYear: {
      type: Number,
      min: [1000, 'Publication year must be a valid year'],
      max: [new Date().getFullYear() + 1, 'Publication year cannot be in the future'],
      default: null,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [0, 'Total copies cannot be negative'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies is required'],
      min: [0, 'Available copies cannot be negative'],
      default: 1,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    // Virtual — stored for querying convenience
    availability: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available',
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────
bookSchema.index({ title: 'text', author: 'text', isbn: 'text' }); // text search
bookSchema.index({ category: 1 });
bookSchema.index({ availability: 1 });
bookSchema.index({ createdAt: -1 });

// ─── Pre-save Hook ─────────────────────────────────────────────────────────
// Automatically set the availability status based on availableCopies
bookSchema.pre('save', function (next) {
  this.availability = this.availableCopies > 0 ? 'Available' : 'Unavailable';
  // Ensure availableCopies never exceeds totalCopies
  if (this.availableCopies > this.totalCopies) {
    return next(new Error('Available copies cannot exceed total copies'));
  }
  next();
});

// ─── Pre-update Hook ───────────────────────────────────────────────────────
bookSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.availableCopies !== undefined || update.totalCopies !== undefined) {
    const available = update.availableCopies;
    const total = update.totalCopies;
    if (available !== undefined) {
      update.availability = available > 0 ? 'Available' : 'Unavailable';
    }
    if (available !== undefined && total !== undefined && available > total) {
      return next(new Error('Available copies cannot exceed total copies'));
    }
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
