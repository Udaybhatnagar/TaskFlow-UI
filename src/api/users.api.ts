import apiClient from './client';
import type { User, ApiResponse } from '@/types';

export const usersApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/users/me');
    return res.data.data;
  },
  updateProfile: async (data: { name?: string; avatar?: string }): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>('/users/me', data);
    return res.data.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.patch('/users/me/password', data);
  },
};
