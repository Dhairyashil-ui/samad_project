import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const booksAPI = {
  getAll: (params) => API.get('/books', { params }),
  getOne: (id) => API.get(`/books/${id}`),
  create: (data) => API.post('/books', data),
  update: (id, data) => API.put(`/books/${id}`, data),
  delete: (id) => API.delete(`/books/${id}`),
  getStats: () => API.get('/books/stats/overview'),
};

export const membersAPI = {
  getAll: (params) => API.get('/members', { params }),
  getOne: (id) => API.get(`/members/${id}`),
  updateRole: (id, role) => API.put(`/members/${id}/role`, { role }),
  updateStatus: (id) => API.put(`/members/${id}/status`),
};

export const transactionsAPI = {
  getAll: (params) => API.get('/transactions', { params }),
  getMy: () => API.get('/transactions/my'),
  borrow: (data) => API.post('/transactions/borrow', data),
  returnBook: (id) => API.put(`/transactions/${id}/return`),
  renew: (id) => API.put(`/transactions/${id}/renew`),
  getOverdue: () => API.get('/transactions/overdue/list'),
};

export const reservationsAPI = {
  getAll: (params) => API.get('/reservations', { params }),
  getMy: () => API.get('/reservations/my'),
  create: (bookId) => API.post('/reservations', { bookId }),
  cancel: (id) => API.put(`/reservations/${id}/cancel`),
  markReady: (id) => API.put(`/reservations/${id}/ready`),
};

export const finesAPI = {
  getAll: (params) => API.get('/fines', { params }),
  getMy: () => API.get('/fines/my'),
  pay: (id, method) => API.put(`/fines/${id}/pay`, { paymentMethod: method }),
  waive: (id) => API.put(`/fines/${id}/waive`),
};

export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getRecentActivity: () => API.get('/dashboard/recent-activity'),
  getPopularBooks: () => API.get('/dashboard/popular-books'),
  getMonthlyTrend: () => API.get('/dashboard/monthly-trend'),
};

export default API;
