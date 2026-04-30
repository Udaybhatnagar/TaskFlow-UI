import { useCallback } from 'react';
import { tasksApi, TaskFilters, TaskPayload } from '@/api/tasks.api';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@/types';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const { tasks, isLoading, setTasks, addTask, updateTask, removeTask, setLoading } = useTaskStore();

  const fetchTasks = useCallback(async (filters: TaskFilters) => {
    setLoading(true);
    try {
      const data = await tasksApi.getAll(filters);
      setTasks(data.tasks);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: TaskPayload) => {
    const task = await tasksApi.create(data);
    addTask(task);
    toast.success('Task created!');
    return task;
  }, []);

  const editTask = useCallback(async (id: string, data: Record<string, unknown>) => {
    const task = await tasksApi.update(id, data);
    updateTask(task);
    return task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.delete(id);
    removeTask(id);
    toast.success('Task deleted');
  }, []);

  const moveTask = useCallback(async (id: string, status: Task['status']) => {
    updateTask({ ...tasks.find((t) => t._id === id)!, status });
    try {
      const task = await tasksApi.update(id, { status });
      updateTask(task);
    } catch {
      toast.error('Failed to move task');
    }
  }, [tasks]);

  return { tasks, isLoading, fetchTasks, createTask, editTask, deleteTask, moveTask };
};
