import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AvatarGroup } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Spinner';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { formatDate } from '@/utils/formatters';

const colorPalette = [
  { from: '#6366f1', to: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
  { from: '#8b5cf6', to: '#a78bfa', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
  { from: '#ec4899', to: '#f472b6', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
  { from: '#f59e0b', to: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  { from: '#10b981', to: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  { from: '#3b82f6', to: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
];

export const ProjectsPage: React.FC = () => {
  const { projects, isLoading, fetchProjects } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} · Manage your workspaces
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus size={15} /> New Project</Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-20 w-20 rounded-3xl mb-5 flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <FolderOpen size={32} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No projects yet</h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
            Create your first project to start organizing tasks and collaborating with your team.
          </p>
          <Button onClick={() => setCreateOpen(true)}><Plus size={15} /> Create your first project</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => {
            const palette = colorPalette[i % colorPalette.length];
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/projects/${project._id}`}
                  className="block rounded-2xl p-5 transition-all duration-200 group relative overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: `1px solid ${palette.border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  {/* Background glow */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30"
                    style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }} />

                  {/* Icon & member count */}
                  <div className="flex items-start justify-between mb-4 relative">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}>
                      <FolderOpen size={20} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: palette.bg, color: palette.from }}>
                      <Users size={11} />
                      {project.members.length}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-bold mb-1 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {project.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-4 min-h-[40px]" style={{ color: 'var(--text-muted)' }}>
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between relative">
                    <AvatarGroup users={project.members.map(m => m.user)} max={4} size="xs" />
                    <div className="flex items-center gap-1 text-xs group-hover:gap-2 transition-all" style={{ color: palette.from }}>
                      Open <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <CreateProjectModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreated={fetchProjects} />
    </div>
  );
};
