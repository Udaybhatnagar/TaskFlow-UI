import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { Task } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, data: Record<string, unknown>) => Promise<void>;
}

const colStyles: Record<string, { dot: string; header: string; zone: string; badge: string }> = {
  todo: {
    dot: '#94a3b8',
    header: 'rgba(148,163,184,0.1)',
    zone: 'rgba(148,163,184,0.04)',
    badge: 'rgba(148,163,184,0.15)',
  },
  'in-progress': {
    dot: '#f59e0b',
    header: 'rgba(245,158,11,0.1)',
    zone: 'rgba(245,158,11,0.04)',
    badge: 'rgba(245,158,11,0.15)',
  },
  done: {
    dot: '#10b981',
    header: 'rgba(16,185,129,0.1)',
    zone: 'rgba(16,185,129,0.04)',
    badge: 'rgba(16,185,129,0.15)',
  },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id, title, color, tasks, onAddTask, onDeleteTask, onUpdateTask,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = colStyles[id] || colStyles.todo;

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1 py-2 rounded-xl" style={{ background: style.header }}>
        <div className="flex items-center gap-2 pl-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: style.dot, boxShadow: `0 0 6px ${style.dot}` }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: style.badge, color: style.dot }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 mr-1"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          title="Add task"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[480px] rounded-2xl p-2 space-y-2.5 transition-all duration-200"
        style={{
          background: isOver ? `${style.dot}10` : style.zone,
          border: `2px dashed ${isOver ? style.dot : 'transparent'}`,
        }}
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanTaskCard
              key={task._id}
              task={task}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 gap-1">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: style.badge }}>
              <Plus size={16} style={{ color: style.dot }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};
