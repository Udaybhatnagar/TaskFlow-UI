import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/hooks/useProjects';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { createProject } = useProjects();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createProject(data);
      reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create project';
      toast.error(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="project-title"
          label="Project Title"
          placeholder="e.g. Website Redesign"
          error={errors.title?.message}
          {...register('title')}
        />
        <Textarea
          id="project-desc"
          label="Description (optional)"
          placeholder="What is this project about?"
          rows={3}
          {...register('description')}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Create Project</Button>
        </div>
      </form>
    </Modal>
  );
};
