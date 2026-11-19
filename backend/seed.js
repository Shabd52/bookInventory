/**
 * Database Seed Script
 * Run: node seed.js
 * Populates the book_inventory database with 12 sample books
 * across various categories.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Book = require('./models/Book');

const sampleBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    category: 'Programming',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    totalCopies: 10,
    availableCopies: 7,
    description:
      'A handbook of agile software craftsmanship. Filled with practical wisdom on writing clean, readable, maintainable code.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    isbn: '9780201616224',
    category: 'Programming',
    publisher: 'Addison-Wesley',
    publicationYear: 1999,
    totalCopies: 8,
    availableCopies: 5,
    description:
      'From journeyman to master — a classic guide to practical software development techniques and philosophy.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg',
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    isbn: '9780262033848',
    category: 'Computer Science',
    publisher: 'MIT Press',
    publicationYear: 2009,
    totalCopies: 15,
    availableCopies: 10,
    description:
      'Comprehensive textbook covering a broad range of algorithms in depth, widely used in universities worldwide.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg',
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth',
    isbn: '9780078022159',
    category: 'Database Management',
    publisher: 'McGraw-Hill Education',
    publicationYear: 2010,
    totalCopies: 12,
    availableCopies: 0,
    description:
      'A foundational textbook for understanding database design, SQL, transactions, and system architecture.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780078022159-M.jpg',
  },
  {
    title: 'Learning React',
    author: 'Alex Banks, Eve Porcello',
    isbn: '9781492051725',
    category: 'Web Development',
    publisher: "O'Reilly Media",
    publicationYear: 2020,
    totalCopies: 6,
    availableCopies: 4,
    description:
      'A hands-on guide to building web applications using React and its ecosystem including hooks and context.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781492051725-M.jpg',
  },
  {
    title: 'Node.js Design Patterns',
    author: 'Mario Casciaro, Luciano Mammino',
    isbn: '9781839214110',
    category: 'Web Development',
    publisher: 'Packt Publishing',
    publicationYear: 2020,
    totalCopies: 7,
    availableCopies: 3,
    description:
      'A comprehensive guide to designing and building enterprise-grade Node.js applications using proven patterns.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781839214110-M.jpg',
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    isbn: '9780134610993',
    category: 'Artificial Intelligence',
    publisher: 'Pearson',
    publicationYear: 2020,
    totalCopies: 10,
    availableCopies: 6,
    description:
      'The leading textbook in Artificial Intelligence. Used in over 1500 universities worldwide.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780134610993-M.jpg',
  },
  {
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    isbn: '9780262035613',
    category: 'Artificial Intelligence',
    publisher: 'MIT Press',
    publicationYear: 2016,
    totalCopies: 5,
    availableCopies: 2,
    description:
      'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780262035613-M.jpg',
  },
  {
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    isbn: '9780073383095',
    category: 'Mathematics',
    publisher: 'McGraw-Hill Education',
    publicationYear: 2011,
    totalCopies: 20,
    availableCopies: 15,
    description:
      'Covers essential discrete mathematics topics including logic, sets, functions, relations, and graph theory.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780073383095-M.jpg',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Fiction',
    publisher: 'Scribner',
    publicationYear: 1925,
    totalCopies: 8,
    availableCopies: 8,
    description:
      'A novel set in the Jazz Age exploring themes of wealth, love, idealism and social upheaval in 1920s America.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg',
  },
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter B. Galvin',
    isbn: '9781119800361',
    category: 'Computer Science',
    publisher: 'Wiley',
    publicationYear: 2018,
    totalCopies: 10,
    availableCopies: 0,
    description:
      'Known as the "Dinosaur Book", this text covers the fundamental principles of modern operating systems.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781119800361-M.jpg',
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum, David J. Wetherall',
    isbn: '9780132126953',
    category: 'Computer Science',
    publisher: 'Pearson',
    publicationYear: 2010,
    totalCopies: 9,
    availableCopies: 5,
    description:
      'An in-depth study of computer networking covering physical, data link, network, transport, and application layers.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132126953-M.jpg',
  },
];

const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Book.deleteMany({});
    console.log('🗑️   Cleared existing books');

    // Insert sample books
    const inserted = await Book.insertMany(sampleBooks);
    console.log(`✅  Inserted ${inserted.length} sample books successfully`);

    // Print summary
    const categories = [...new Set(sampleBooks.map((b) => b.category))];
    console.log(`📚  Categories: ${categories.join(', ')}`);
  } catch (error) {
    console.error(`❌  Seed error: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  Database connection closed');
    process.exit(0);
  }
};

seedDatabase();
