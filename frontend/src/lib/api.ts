import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (username: string, email: string, password: string) =>
    api.post('/users/register', { username, email, password }),

  login: (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    return api.post('/users/login', {
      [isEmail ? 'email' : 'username']: identifier,
      password,
    });
  },

  logout: () => api.post('/users/logout'),

  refreshToken: () => api.post('/users/refresh-token'),
};

// Tasks API
export const tasksApi = {
  getAll: () => api.get('/tasks/'),

  create: (title: string, description?: string, deadline?: string) =>
    api.post('/tasks/', { title, description, deadline }),

  update: (id: string, title: string, description?: string, deadline?: string) =>
    api.patch(`/tasks/${id}`, { title, description, deadline }),

  delete: (id: string) => api.delete(`/tasks/${id}`),

  toggleCompletion: (id: string) => api.post(`/tasks/${id}`),
};

export default api;
