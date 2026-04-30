import apiClient from './client';
import type { Project, ProjectMember, ApiResponse } from '@/types';

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return res.data.data;
  },
  getById: async (id: string): Promise<Project> => {
    const res = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },
  create: async (data: { title: string; description?: string }): Promise<Project> => {
    const res = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return res.data.data;
  },
  update: async (id: string, data: { title?: string; description?: string }): Promise<Project> => {
    const res = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
  addMember: async (id: string, data: { email: string; role: string }): Promise<Project> => {
    const res = await apiClient.post<ApiResponse<Project>>(`/projects/${id}/members`, data);
    return res.data.data;
  },
  removeMember: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}/members/${userId}`);
  },
};
