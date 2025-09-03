import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if(typeof window !== 'undefined'){
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  login: (identifier: string, password: string) => 
    api.post('/api/auth/local', { identifier, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/api/auth/local/register', { username, email, password }),
};

export const coursesAPI = {
  getAll: (url: string) => api.get('/api/courses?populate=*'),
  getOne: (id: string) => api.get(`/api/courses/${id}?populate=*`),
};

export default api;