import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear storage
      const token = localStorage.getItem('campusconnect_token');
      if (token && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('campusconnect_token');
        localStorage.removeItem('campusconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
};

// Event Services
export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// Registration Services
export const registrationService = {
  registerForEvent: (eventId) => api.post('/registrations', { eventId }),
  getMyRegistrations: (params) => api.get('/registrations/my', { params }),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  cancelRegistration: (id, reason) => api.delete(`/registrations/${id}`, { data: { reason } }),
};

// Admin Services
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getAllRegistrations: (params) => api.get('/admin/registrations', { params }),
};

export default api;
