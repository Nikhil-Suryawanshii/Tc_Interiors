import axios from 'axios';

const rawApiBaseUrl =
  process.env.REACT_APP_API_URL ||
  process.env.VITE_API_URL ||
  '/api';

const apiBaseUrl = rawApiBaseUrl.replace(/\/api\/v\d+$/, '/api');

export const ASSET_BASE_URL = apiBaseUrl.replace(/\/api$/, '');

// Use explicit API URL if set, otherwise use proxy (empty string = relative URL)
const API = axios.create({
  baseURL: apiBaseUrl,
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

export default API;

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/me', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Projects
export const getProjects = (params) => API.get('/projects', { params });
export const getProject = (slug) => API.get(`/projects/${slug}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Services
export const getServices = () => API.get('/services');
export const getService = (slug) => API.get(`/services/${slug}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// Blog
export const getBlogs = (params) => API.get('/blog', { params });
export const getBlog = (slug) => API.get(`/blog/${slug}`);
export const createBlog = (data) => API.post('/blog', data);
export const updateBlog = (id, data) => API.put(`/blog/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blog/${id}`);
export const getAllBlogsAdmin = (params) => API.get('/blog/admin/all', { params });

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Reviews
export const getReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);
export const approveReview = (id) => API.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Consultations
export const bookConsultation = (data) => API.post('/consultations', data);
export const getConsultations = (params) => API.get('/consultations', { params });
export const updateConsultation = (id, data) => API.put(`/consultations/${id}`, data);

// Upload
export const uploadImage = (formData) => API.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadVideo = (formData) => API.post('/upload/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadMultiple = (formData) => API.post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Admin stats
export const getAdminStats = () => API.get('/admin/stats');

// Settings
export const getSettings    = ()          => API.get('/settings');
export const getSettingKey  = (key)       => API.get(`/settings/${key}`);
export const updateSetting  = (key, data) => API.put(`/settings/${key}`, data);
