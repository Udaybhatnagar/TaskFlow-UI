import { create } from 'zustand';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (project) =>
    set((s) => ({
      projects: s.projects.map((p) => (p._id === project._id ? project : p)),
      currentProject: s.currentProject?._id === project._id ? project : s.currentProject,
    })),
  removeProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p._id !== id),
      currentProject: s.currentProject?._id === id ? null : s.currentProject,
    })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setLoading: (isLoading) => set({ isLoading }),
}));
