import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, FolderOpen, Plus, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { tasksApi } from '@/api/tasks.api';
import { useProjects } from '@/hooks/useProjects';
import type { DashboardData } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { timeAgo } from '@/utils/formatters';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const { fetchProjects } = useProjects();

  useEffect(() => {
    Promise.all([
      tasksApi.getDashboardStats().then(setData),
      fetchProjects(),
    ]).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const stats = [
    {
      label: 'Total Tasks', value: data?.stats.total ?? 0,
      icon: ListTodo, gradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
      iconClass: 'stat-icon-indigo', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)',
      change: '+12%',
    },
    {
      label: 'Completed', value: data?.stats.completed ?? 0,
      icon: CheckCircle2, gradient: 'linear-gradient(135deg,#10b981,#34d399)',
      iconClass: 'stat-icon-emerald', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
      change: '+8%',
    },
    {
      label: 'In Progress', value: data?.stats.pending ?? 0,
      icon: Clock, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
      iconClass: 'stat-icon-amber', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
      change: '–3%',
    },
    {
      label: 'Overdue', value: data?.stats.overdue ?? 0,
      icon: AlertTriangle, gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)',
      iconClass: 'stat-icon-rose', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)',
      change: data?.stats.overdue ? '⚠️' : '✓',
    },
  ];

  const chartData = data?.completedByDay.map(d => ({
    date: d._id.slice(5),
    completed: d.count,
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={stagger}>

        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button onClick={() => setCreateProjectOpen(true)}>
            <Plus size={15} /> New Project
          </Button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="stat-card relative overflow-hidden"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              {/* Glow blob */}
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: s.gradient }} />
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.gradient }}>
                <s.icon size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>
                  {loading ? <span className="animate-pulse">—</span> : s.value}
                </p>
                <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              }}>{s.change}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={fadeUp} className="grid lg:grid-cols-3 gap-5 mb-6">

          {/* Area Chart */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
                  <TrendingUp size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Task Completion</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                <ArrowUpRight size={14} /> +{(data?.stats.completed ?? 0)} done
              </div>
            </div>
            {loading ? (
              <div className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-muted)' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad1)" name="Completed" dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Projects Panel */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Projects <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>({data?.projectCount ?? 0})</span>
              </p>
              <Link to="/projects" className="text-xs font-medium text-indigo-500 hover:text-indigo-400 flex items-center gap-0.5">
                All <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                ))
              ) : projects.slice(0, 5).map((p, i) => {
                const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'];
                const c = colors[i % colors.length];
                return (
                  <Link key={p._id} to={`/projects/${p._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-all group"
                    style={{ '&:hover': { background: 'var(--bg-elevated)' } } as React.CSSProperties}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c}20` }}>
                      <FolderOpen size={15} style={{ color: c }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.members.length} members</p>
                    </div>
                  </Link>
                );
              })}
              {!loading && projects.length === 0 && (
                <div className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                  No projects yet.<br />
                  <button onClick={() => setCreateProjectOpen(true)} className="text-indigo-500 hover:underline mt-1">Create one</button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="card p-5">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</p>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
              ))}
            </div>
          ) : data?.recentTasks.length ? (
            <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' } as React.CSSProperties}>
              {data.recentTasks.map((t, i) => (
                <motion.div key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {typeof t.projectId === 'object' ? (t.projectId as any).title : ''} · {timeAgo(t.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                    {t.assignedTo && <Avatar name={t.assignedTo.name} size="xs" />}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              No recent activity. Start by creating a task!
            </div>
          )}
        </motion.div>
      </motion.div>

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={fetchProjects}
      />
    </div>
  );
};
