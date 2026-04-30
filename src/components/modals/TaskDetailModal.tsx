import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { Task } from '@/types';
import { formatDate, timeAgo } from '@/utils/formatters';
import { Trash2, Calendar, User, Lock, Edit3 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen, onClose, task, onUpdate, onDelete,
}) => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [saving, setSaving] = useState(false);

  // RBAC: admin or task creator can fully edit; member can only change status
  const isAdmin = user?.role === 'admin';
  const isCreator = task.createdBy?._id === user?._id || (task.createdBy as any) === user?._id;
  const canFullEdit = isAdmin || isCreator;

  const handleStatusChange = async (newStatus: Task['status']) => {
    setStatus(newStatus);
    try {
      await onUpdate(task._id, { status: newStatus });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(task._id, { title, description, status, priority });
      toast.success('Task updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete(task._id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-5">
        {editing && canFullEdit ? (
          /* ─── FULL EDIT (Admin / Creator) ─── */
          <div className="space-y-4">
            <Input id="edit-title" label="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea id="edit-desc" label="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Select id="edit-status" label="Status" value={status} onChange={e => setStatus(e.target.value as Task['status'])}
                options={[{ value: 'todo', label: 'Todo' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }]} />
              <Select id="edit-priority" label="Priority" value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}
                options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} loading={saving} className="flex-1">Save Changes</Button>
            </div>
          </div>
        ) : (
          /* ─── VIEW MODE ─── */
          <>
            {/* Title & description */}
            <div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
              {task.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
              )}
            </div>

            {/* Status & Priority badges */}
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>

            {/* Member: inline status change only */}
            {!canFullEdit && (
              <div className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={13} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>You can update the task status</p>
                </div>
                <div className="flex gap-2">
                  {(['todo', 'in-progress', 'done'] as Task['status'][]).map(s => {
                    const active = status === s;
                    const labels: Record<string, string> = { 'todo': 'Todo', 'in-progress': 'In Progress', 'done': 'Done' };
                    const colors: Record<string, string> = {
                      'todo': active ? 'rgba(148,163,184,0.3)' : 'transparent',
                      'in-progress': active ? 'rgba(245,158,11,0.2)' : 'transparent',
                      'done': active ? 'rgba(16,185,129,0.2)' : 'transparent',
                    };
                    const textColors: Record<string, string> = {
                      'todo': '#94a3b8', 'in-progress': '#f59e0b', 'done': '#10b981',
                    };
                    return (
                      <button key={s} onClick={() => handleStatusChange(s)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border"
                        style={{
                          background: colors[s],
                          color: textColors[s],
                          borderColor: active ? textColors[s] + '50' : 'var(--border)',
                          transform: active ? 'scale(1.02)' : 'scale(1)',
                        }}>
                        {labels[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assignee & due date */}
            <div className="grid grid-cols-2 gap-4">
              {task.assignedTo && (
                <div className="flex items-center gap-2">
                  <User size={13} style={{ color: 'var(--text-muted)' }} />
                  <Avatar name={task.assignedTo.name} size="xs" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{task.assignedTo.name}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>

            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Created by {task.createdBy?.name} · {timeAgo(task.createdAt)}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              {canFullEdit && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 size={14} /> Delete
                </Button>
              )}
              {canFullEdit && (
                <Button size="sm" onClick={() => setEditing(true)} className="ml-auto">
                  <Edit3 size={14} /> Edit Task
                </Button>
              )}
              {!canFullEdit && (
                <p className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                  <Lock size={11} /> Only admins can edit task details
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
