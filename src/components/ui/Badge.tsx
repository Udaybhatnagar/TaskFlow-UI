import React from 'react';
import { cn } from '@/utils/cn';
import type { TaskStatus, TaskPriority } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={cn('badge', className)}>{children}</span>
);

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const map: Record<TaskStatus, string> = {
    todo: 'badge-todo',
    'in-progress': 'badge-in-progress',
    done: 'badge-done',
  };
  const label: Record<TaskStatus, string> = {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
  };
  return <span className={cn('badge', map[status])}>{label[status]}</span>;
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const map: Record<TaskPriority, string> = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
  };
  const icons: Record<TaskPriority, string> = { low: '▼', medium: '●', high: '▲' };
  return (
    <span className={cn('badge gap-1', map[priority])}>
      <span className="text-[10px]">{icons[priority]}</span>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};
