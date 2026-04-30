import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/hooks/useTasks';
import type { Project } from '@/types';
import type { TaskPayload } from '@/api/tasks.api';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  defaultStatus?: 'todo' | 'in-progress' | 'done';
  onCreated?: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen, onClose, project, defaultStatus = 'todo', onCreated,
}) => {
  const { createTask } = useTasks();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium', status: defaultStatus },
  });

  const members = project.members.map((m) => ({ value: m.user._id, label: m.user.name }));

  const onSubmit = async (data: FormData) => {
    try {
      const payload: TaskPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate || null,
        projectId: project._id,
        ...(data.assignedTo ? { assignedTo: data.assignedTo } : {}),
      };
      await createTask(payload);
      reset();
      onClose();
      onCreated?.();
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input id="task-title" label="Task Title" placeholder="What needs to be done?" error={errors.title?.message} {...register('title')} />
        <Textarea id="task-desc" label="Description" placeholder="Add more context…" rows={3} {...register('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Select id="task-priority" label="Priority"
            options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]}
            {...register('priority')} />
          <Select id="task-status" label="Status"
            options={[{ value: 'todo', label: 'Todo' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }]}
            {...register('status')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select id="task-assignee" label="Assignee (optional)"
            options={[{ value: '', label: 'Unassigned' }, ...members]}
            {...register('assignedTo')} />
          <Input id="task-due" label="Due Date" type="date" {...register('dueDate')} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};
