import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { Task } from '@/types';
import { formatDate, isOverdue } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { useState } from 'react';

const priorityAccent: Record<string, string> = {
  high: 'rgba(239,68,68,0.5)',
  medium: 'rgba(245,158,11,0.5)',
  low: 'rgba(59,130,246,0.4)',
};

interface KanbanTaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>;
}

export const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({ task, onDelete, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const [detailOpen, setDetailOpen] = useState(false);

  const style = { transform: CSS.Transform.toString(transform), transition };
  const overdue = task.dueDate && task.status !== 'done' && isOverdue(task.dueDate);
  const accent = priorityAccent[task.priority] || priorityAccent.medium;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn('group cursor-pointer rounded-2xl transition-all duration-200', isDragging && 'opacity-40 scale-105 rotate-1 shadow-2xl')}
      >
        <div
          onClick={() => setDetailOpen(true)}
          className="p-4 rounded-2xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: `3px solid ${accent}`,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div className="flex items-start gap-2">
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              onClick={e => e.stopPropagation()}
              className="mt-0.5 p-0.5 rounded transition-opacity cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 flex-shrink-0"
              style={{ color: 'var(--text-subtle)' }}
            >
              <GripVertical size={14} />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug line-clamp-2 mb-2.5" style={{ color: 'var(--text-primary)' }}>
                {task.title}
              </p>

              <div className="flex items-center justify-between">
                <PriorityBadge priority={task.priority} />
                <div className="flex items-center gap-2">
                  {task.dueDate && (
                    <span className={cn('flex items-center gap-1 text-xs', overdue ? 'text-rose-500' : '')}
                      style={{ color: overdue ? undefined : 'var(--text-muted)' }}>
                      <Calendar size={11} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.assignedTo && <Avatar name={task.assignedTo.name} avatar={task.assignedTo.avatar} size="xs" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
};
