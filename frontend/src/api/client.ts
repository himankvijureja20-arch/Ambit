import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: any, fallback: string): string {
  if (!error?.response) {
    return 'Cannot reach the server. Check your connection and try again.';
  }
  return error.response?.data?.error || fallback;
}

export const circles = {
  list: () => apiClient.get('/circles'),
  get: (id: number) => apiClient.get(`/circles/${id}`),
  create: (data: any) => apiClient.post('/circles', data),
  join: (id: number) => apiClient.post(`/circles/${id}/join`),
  leave: (id: number) => apiClient.post(`/circles/${id}/leave`),
};

export const requests = {
  list: () => apiClient.get('/requests'),
  listByCircle: (circleId: number) => apiClient.get(`/requests/circle/${circleId}`),
  get: (id: number) => apiClient.get(`/requests/${id}`),
  create: (data: any) => apiClient.post('/requests', data),
  respond: (id: number, data: any) => apiClient.post(`/requests/${id}/respond`, data),
  update: (id: number, data: any) => apiClient.patch(`/requests/${id}`, data),
  confirm: (requestId: number, responseId: number) =>
    apiClient.post(`/requests/${requestId}/responses/${responseId}/confirm`),
};

export const profile = {
  get: () => apiClient.get('/profile'),
  update: (data: any) => apiClient.patch('/profile', data),
  getCircles: () => apiClient.get('/profile/circles'),
  topHelpers: () => apiClient.get('/profile/top-helpers'),
};

export const admin = {
  pendingUsers: () => apiClient.get('/admin/pending-users'),
  approveUser: (id: number) => apiClient.post(`/admin/users/${id}/approve`),
  rejectUser: (id: number) => apiClient.post(`/admin/users/${id}/reject`),
  pendingCircles: () => apiClient.get('/admin/pending-circles'),
  approveCircle: (id: number) => apiClient.post(`/admin/circles/${id}/approve`),
  rejectCircle: (id: number) => apiClient.post(`/admin/circles/${id}/reject`),
  requests: () => apiClient.get('/admin/requests'),
  removeRequest: (id: number) => apiClient.post(`/admin/requests/${id}/remove`),
  flagRequest: (id: number) => apiClient.post(`/admin/requests/${id}/flag`),
  unflagRequest: (id: number) => apiClient.post(`/admin/requests/${id}/unflag`),
};
