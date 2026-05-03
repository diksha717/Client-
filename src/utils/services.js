import api from './api.js';

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User API calls
export const userAPI = {
  getUsers: () => api.get('/users'),
  getCurrentUser: () => api.get('/users/me'),
  getUserStats: () => api.get('/users/me/stats'),
};

// Project API calls
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members`, { userId }),
  removeMember: (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`),
  getProjectStats: (id) => api.get(`/projects/${id}/stats`),
};

// Task API calls
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getTasks: (filters) => api.get('/tasks', { params: filters }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  addComment: (taskId, content) => api.post(`/tasks/${taskId}/comments`, { content }),
  getComments: (taskId) => api.get(`/tasks/${taskId}/comments`),
};
