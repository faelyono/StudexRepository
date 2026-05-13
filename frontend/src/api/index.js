import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const register = (data)   => api.post('/auth/register', data);
export const login    = (data)   => api.post('/auth/login', data);
export const getMe    = ()       => api.get('/auth/me');

// Courses
export const getCourses  = ()   => api.get('/courses');
export const enroll      = (id) => api.post(`/courses/enroll/${id}`);
export const getLessons  = (id) => api.get(`/courses/${id}/lessons`);
export const getCards    = (topicId) => api.get(`/courses/topics/${topicId}/flashcards`);

// Study
export const completeSession = (data) => api.post('/study/complete', data);

// Tasks
export const getTasks      = ()           => api.get('/tasks');
export const createTask    = (data)       => api.post('/tasks', data);
export const updateTask    = (id, data)   => api.put(`/tasks/${id}`, data);
export const deleteTask    = (id)         => api.delete(`/tasks/${id}`);
export const completeTask  = (id)         => api.patch(`/tasks/${id}/complete`);

// Leaderboard
export const getGlobalLB  = ()   => api.get('/leaderboard/global');
export const getCourseLB  = (id) => api.get(`/leaderboard/course/${id}`);
