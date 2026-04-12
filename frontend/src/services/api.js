// TC Interior — frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({ baseURL: API_URL, withCredentials: true, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(
  (config) => {
    // Move _skipAuthRefresh from params/data into config meta so it doesn't get sent to server
    if (config._skipAuthRefresh === undefined && config.params?._skipAuthRefresh) {
      config._skipAuthRefresh = true;
      const { _skipAuthRefresh: _, ...rest } = config.params;
      config.params = rest;
    }
    const t = localStorage.getItem('token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orig = error.config;
    // Skip auth refresh for requests that opted out (e.g. public-page widgets)
    if (orig._skipAuthRefresh) return Promise.reject(error);

    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const rt = localStorage.getItem('refreshToken');

      // Only attempt refresh if we actually have a refresh token
      if (rt) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: rt });
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          orig.headers.Authorization = `Bearer ${data.data.token}`;
          return api(orig);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      } else {
        // No refresh token — clear any stale access token silently
        localStorage.removeItem('token');
      }

      // Only redirect to /login if we're on an admin page
      const isAdminPage = window.location.pathname.startsWith('/admin');
      if (isAdminPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (d) => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (d) => api.put('/auth/password', d),
  refreshToken: (rt) => api.post('/auth/refresh', { refreshToken: rt }),
};

export const productsAPI = {
  getAll:    (p) => api.get('/products', { params: p }),
  getAdminAll: () => api.get('/products/admin/all'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create:    (d) => api.post('/products', d),
  update:    (id,d) => api.put(`/products/${id}`, d),
  delete:    (id) => api.delete(`/products/${id}`),
  addImage:  (id,fd) => api.post(`/products/${id}/images`, fd, { headers:{ 'Content-Type':'multipart/form-data' } }),
  removeImage: (id,pid) => api.delete(`/products/${id}/images/${encodeURIComponent(pid)}`),
};

export const categoriesAPI = {
  getAll:    () => api.get('/categories'),
  getAdminAll: () => api.get('/categories/admin/all'),
  create:    (d) => api.post('/categories', d),
  update:    (id,d) => api.put(`/categories/${id}`, d),
  delete:    (id) => api.delete(`/categories/${id}`),
  uploadImage: (id,fd) => api.post(`/categories/${id}/image`, fd, { headers:{ 'Content-Type':'multipart/form-data' } }),
};

export const enquiriesAPI = {
  submit:    (d) => api.post('/enquiries', d),
  getAll:    (p) => api.get('/enquiries', { params: p }),
  updateStatus: (id,d) => api.put(`/enquiries/${id}/status`, d),
  delete:    (id) => api.delete(`/enquiries/${id}`),
};

export const galleryAPI = {
  getAll:    (p) => api.get('/gallery', { params: p }),
  getAdminAll: () => api.get('/gallery/admin/all'),
  create:    (fd) => api.post('/gallery', fd, { headers:{ 'Content-Type':'multipart/form-data' } }),
  update:    (id,d) => api.put(`/gallery/${id}`, d),
  delete:    (id) => api.delete(`/gallery/${id}`),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  create: (d) => api.post('/testimonials', d),
  update: (id,d) => api.put(`/testimonials/${id}`, d),
  delete: (id) => api.delete(`/testimonials/${id}`),
  uploadAvatar: (id,fd) => api.post(`/testimonials/${id}/avatar`, fd, { headers:{ 'Content-Type':'multipart/form-data' } }),
};

export const projectsAPI  = { getAll:(p)=>api.get('/projects',{params:p}), getBySlug:(s)=>api.get(`/projects/${s}`), create:(d)=>api.post('/projects',d), update:(id,d)=>api.put(`/projects/${id}`,d), delete:(id)=>api.delete(`/projects/${id}`), uploadImage:(id,fd)=>api.post(`/projects/${id}/images`,fd,{headers:{'Content-Type':'multipart/form-data'}}) };
export const skillsAPI    = { getAll:()=>api.get('/skills'), create:(d)=>api.post('/skills',d), update:(id,d)=>api.put(`/skills/${id}`,d), delete:(id)=>api.delete(`/skills/${id}`) };
export const experienceAPI= { getAll:()=>api.get('/experience'), create:(d)=>api.post('/experience',d), update:(id,d)=>api.put(`/experience/${id}`,d), delete:(id)=>api.delete(`/experience/${id}`) };
export const servicesAPI  = { getAll:()=>api.get('/services'), create:(d)=>api.post('/services',d), update:(id,d)=>api.put(`/services/${id}`,d), delete:(id)=>api.delete(`/services/${id}`) };
export const blogAPI      = { getAll:(p)=>api.get('/blog',{params:p}), getBySlug:(s)=>api.get(`/blog/${s}`), create:(d)=>api.post('/blog',d), update:(id,d)=>api.put(`/blog/${id}`,d), delete:(id)=>api.delete(`/blog/${id}`), uploadCover:(id,fd)=>api.post(`/blog/${id}/cover`,fd,{headers:{'Content-Type':'multipart/form-data'}}) };
export const siteSettingsAPI = { get:()=>api.get('/site-settings'), update:(d)=>api.put('/site-settings',d) };
export const analyticsAPI = { trackPageView:(d)=>api.post('/analytics/pageview',d), getDashboard:(p)=>api.get('/analytics/dashboard',{params:p}), getRealTime:()=>api.get('/analytics/realtime'), trackEvent:(d)=>api.post('/analytics/event',d), trackProjectView:(id)=>api.post(`/analytics/project/${id}/view`) };
export const contactAPI   = { submit:(d)=>api.post('/contact',d), getAll:(p)=>api.get('/contact',{params:p}), getStats:()=>api.get('/contact/stats'), updateStatus:(id,d)=>api.put(`/contact/${id}/status`,d), delete:(id)=>api.delete(`/contact/${id}`) };
export const profileAPI   = { get:()=>api.get('/profile'), update:(d)=>api.put('/profile',d), uploadAvatar:(fd)=>api.post('/profile/avatar',fd,{headers:{'Content-Type':'multipart/form-data'}}), uploadResume:(fd)=>api.post('/profile/resume',fd,{headers:{'Content-Type':'multipart/form-data'}}), getResumeDownloadUrl:()=>api.get('/profile/resume/download-url'), deleteResume:()=>api.delete('/profile/resume') };
export const auditLogAPI  = { getAll:(p)=>api.get('/audit-log',{params:p}) };

export default api;
