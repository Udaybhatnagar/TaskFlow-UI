import { useState, useCallback } from 'react';
import { projectsApi } from '@/api/projects.api';
import { useProjectStore } from '@/store/projectStore';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const { projects, currentProject, isLoading, setProjects, addProject, updateProject, removeProject, setCurrentProject, setLoading } = useProjectStore();
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await projectsApi.getById(id);
      setCurrentProject(data);
      return data;
    } catch {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: { title: string; description?: string }) => {
    const project = await projectsApi.create(data);
    addProject(project);
    toast.success('Project created!');
    return project;
  }, []);

  const editProject = useCallback(async (id: string, data: { title?: string; description?: string }) => {
    const project = await projectsApi.update(id, data);
    updateProject(project);
    toast.success('Project updated!');
    return project;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await projectsApi.delete(id);
    removeProject(id);
    toast.success('Project deleted');
  }, []);

  const addMember = useCallback(async (id: string, data: { email: string; role: string }) => {
    const project = await projectsApi.addMember(id, data);
    updateProject(project);
    setCurrentProject(project);
    toast.success('Member added!');
    return project;
  }, []);

  const removeMember = useCallback(async (id: string, userId: string) => {
    await projectsApi.removeMember(id, userId);
    const updated = await projectsApi.getById(id);
    updateProject(updated);
    setCurrentProject(updated);
    toast.success('Member removed');
  }, []);

  return {
    projects, currentProject, isLoading, error,
    fetchProjects, fetchProject, createProject, editProject,
    deleteProject, addMember, removeMember,
  };
};
