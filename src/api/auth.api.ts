import apiClient from './client';
import type { AuthResponse, ApiResponse } from '@/types';

export const authApi = {
  signup: async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return res.data.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },
  refresh: async (refreshToken: string) => {
    const res = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken });
    return res.data.data;
  },
  logout: async (refreshToken: string) => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
