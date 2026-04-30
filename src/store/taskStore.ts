import { create } from 'zustand';
import type { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (task) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t._id === task._id ? task : t)) })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}));
