const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// ─── GET /api/dashboard/stats ──────────────────────────────────────────────
/**
 * @desc    Get dashboard statistics and category-wise distribution
 * @route   GET /api/dashboard/stats
 * @access  Public
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Aggregate statistics in a single efficient query
  const statsAgg = await Book.aggregate([
    {
      $group: {
        _id: null,
        totalBooks: { $sum: 1 },
        totalCopies: { $sum: '$totalCopies' },
        totalAvailableCopies: { $sum: '$availableCopies' },
        unavailableBooks: {
          $sum: { $cond: [{ $eq: ['$availability', 'Unavailable'] }, 1, 0] },
        },
        availableBooks: {
          $sum: { $cond: [{ $eq: ['$availability', 'Available'] }, 1, 0] },
        },
      },
    },
  ]);

  // Category-wise book count
  const categoryAgg = await Book.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalCopies: { $sum: '$totalCopies' },
        availableCopies: { $sum: '$availableCopies' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Recently added books (last 5)
  const recentBooks = await Book.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title author category availability coverImage createdAt');

  const stats = statsAgg[0] || {
    totalBooks: 0,
    totalCopies: 0,
    totalAvailableCopies: 0,
    unavailableBooks: 0,
    availableBooks: 0,
  };

  res.status(200).json({
    success: true,
    data: {
      totalBooks: stats.totalBooks,
      totalCopies: stats.totalCopies,
      totalAvailableCopies: stats.totalAvailableCopies,
      unavailableBooks: stats.unavailableBooks,
      availableBooks: stats.availableBooks,
      totalCategories: categoryAgg.length,
      categoryDistribution: categoryAgg.map((c) => ({
        category: c._id || 'Uncategorized',
        count: c.count,
        totalCopies: c.totalCopies,
        availableCopies: c.availableCopies,
      })),
      recentBooks,
    },
  });
});

module.exports = { getDashboardStats };
