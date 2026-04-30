import apiClient from './client';
import type { Task, PaginatedTasks, DashboardData, ApiResponse } from '@/types';

export interface TaskFilters {
  projectId: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  projectId: string;
  dueDate?: string | null;
}

export const tasksApi = {
  getAll: async (filters: TaskFilters): Promise<PaginatedTasks> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const res = await apiClient.get<ApiResponse<PaginatedTasks>>('/tasks', { params });
    return res.data.data;
  },
  getById: async (id: string): Promise<Task> => {
    const res = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data.data;
  },
  create: async (data: TaskPayload): Promise<Task> => {
    const res = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return res.data.data;
  },
  update: async (id: string, data: Partial<Task> | Record<string, unknown>): Promise<Task> => {
    const res = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
  getDashboardStats: async (): Promise<DashboardData> => {
    const res = await apiClient.get<ApiResponse<DashboardData>>('/tasks/dashboard/stats');
    return res.data.data;
  },
};
