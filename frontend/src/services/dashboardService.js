import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

/**
 * Fetch dashboard statistics from the backend.
 * Returns totalBooks, totalCopies, categoryDistribution, recentBooks, etc.
 */
export const getDashboardStats = () =>
  axios.get(`${API_BASE}/dashboard/stats`);
