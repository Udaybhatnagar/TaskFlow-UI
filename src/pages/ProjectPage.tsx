import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Settings, Kanban, Plus, Trash2, UserMinus, Crown, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { InviteMemberModal } from '@/components/modals/InviteMemberModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/ui/Spinner';
import type { Task } from '@/types';

type Tab = 'board' | 'members' | 'settings';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProject, fetchProject, deleteProject, removeMember } = useProjects();
  const { tasks, fetchTasks } = useTasks();
  const [tab, setTab] = useState<Tab>('board');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [boardTasks, setBoardTasks] = useState<Task[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchProject(id), fetchTasks({ projectId: id, limit: 100 })]).finally(() => setPageLoading(false));
  }, [id]);

  useEffect(() => { setBoardTasks(tasks); }, [tasks]);

  if (pageLoading) return <PageLoader />;
  if (!currentProject) return (
    <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--text-muted)' }}>
      Project not found
    </div>
  );

  const isCreator = currentProject.createdBy._id === user?._id;

  const tabs = [
    { id: 'board' as Tab, label: 'Board', icon: <LayoutGrid size={15} /> },
    { id: 'members' as Tab, label: `Members (${currentProject.members.length})`, icon: <Users size={15} /> },
    ...(isCreator ? [{ id: 'settings' as Tab, label: 'Settings', icon: <Settings size={15} /> }] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="px-6 pt-5 pb-0" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {currentProject.title}
              </h1>
              {isCreator && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Crown size={10} /> Owner
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentProject.description || 'No description.'}</p>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <AvatarGroup users={currentProject.members.map(m => m.user)} max={5} size="sm" />
            <Button size="sm" onClick={() => setCreateTaskOpen(true)}><Plus size={14} /> Add Task</Button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-0.5">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
              style={{
                color: tab === t.id ? '#6366f1' : 'var(--text-muted)',
                borderBottomColor: tab === t.id ? '#6366f1' : 'transparent',
                background: 'transparent',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--bg-base)' }}>
        {tab === 'board' && (
          <KanbanBoard tasks={boardTasks} project={currentProject} onTasksChange={setBoardTasks} />
        )}

        {tab === 'members' && (
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Team Members</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentProject.members.length} members</p>
              </div>
              {isCreator && <Button size="sm" onClick={() => setInviteOpen(true)}><Plus size={14} /> Invite</Button>}
            </div>
            {currentProject.members.map((m, i) => (
              <motion.div key={m.user._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Avatar name={m.user.name} avatar={m.user.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{m.user.name}</p>
                    {m.user._id === currentProject.createdBy._id && (
                      <Crown size={12} className="text-indigo-500" />
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.user.email}</p>
                </div>
                <span className={`badge capitalize ${m.role === 'admin' ? 'badge-high' : 'badge-todo'}`}>{m.role}</span>
                {isCreator && m.user._id !== user?._id && (
                  <button onClick={() => removeMember(currentProject._id, m.user._id)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/10"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    <UserMinus size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'settings' && isCreator && (
          <div className="max-w-lg space-y-6">
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Project Settings</h2>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.25)' }}>
              <h3 className="font-semibold text-rose-500 mb-1.5">Danger Zone</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Permanently delete this project and all tasks associated with it. This action cannot be undone.
              </p>
              <Button variant="danger" onClick={async () => {
                if (!window.confirm('Delete this project? This cannot be undone.')) return;
                await deleteProject(currentProject._id);
                navigate('/projects');
              }}>
                <Trash2 size={14} /> Delete Project
              </Button>
            </div>
          </div>
        )}
      </div>

      <InviteMemberModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} projectId={currentProject._id} />
      {currentProject && (
        <CreateTaskModal isOpen={createTaskOpen} onClose={() => setCreateTaskOpen(false)} project={currentProject}
          onCreated={() => fetchTasks({ projectId: currentProject._id, limit: 100 })} />
      )}
    </div>
  );
};
