import React, { useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { Task, Project } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';

interface KanbanBoardProps {
  tasks: Task[];
  project: Project;
  onTasksChange: (tasks: Task[]) => void;
}

const COLUMNS = [
  { id: 'todo', title: 'Todo', color: 'bg-gray-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-400' },
  { id: 'done', title: 'Done', color: 'bg-emerald-400' },
] as const;

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, project, onTasksChange }) => {
  const { editTask, deleteTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createModal, setCreateModal] = useState<{ open: boolean; status: Task['status'] }>({
    open: false, status: 'todo',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const targetStatus = COLUMNS.find((c) => c.id === overId)?.id
      || tasks.find((t) => t._id === overId)?.status;

    if (!targetStatus || activeTask.status === targetStatus) return;

    // Optimistic update
    const updated = tasks.map((t) =>
      t._id === activeTask._id ? { ...t, status: targetStatus as Task['status'] } : t
    );
    onTasksChange(updated);
    await editTask(activeTask._id, { status: targetStatus });
  };

  const handleUpdateTask = async (id: string, data: Record<string, unknown>) => {
    await editTask(id, data);
    onTasksChange(tasks.map((t) => (t._id === id ? { ...t, ...data } : t)));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    onTasksChange(tasks.filter((t) => t._id !== id));
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={getTasksByStatus(col.id)}
              onAddTask={() => setCreateModal({ open: true, status: col.id as Task['status'] })}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <KanbanTaskCard
              task={activeTask}
              onDelete={() => {}}
              onUpdate={async () => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={createModal.open}
        onClose={() => setCreateModal({ open: false, status: 'todo' })}
        project={project}
        defaultStatus={createModal.status}
        onCreated={() => {}}
      />
    </>
  );
};
