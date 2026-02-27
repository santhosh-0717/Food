import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerRestaurantOwner: (data) => api.post('/auth/register/restaurant-owner', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getOne: (id) => api.get(`/restaurants/${id}`),
  getMyRestaurants: () => api.get('/restaurants/my/restaurants'),
};

// Food APIs
export const foodAPI = {
  getAll: (params) => api.get('/foods', { params }),
  getOne: (id) => api.get(`/foods/${id}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getOne: (id) => api.get(`/orders/${id}`),
  getRestaurantOrders: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { orderStatus: status }),
};

export default api;