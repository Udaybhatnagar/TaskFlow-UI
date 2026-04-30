import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, User, LogOut,
  ChevronLeft, ChevronRight, Zap, Plus, Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/projectStore';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { projects } = useProjectStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="relative flex flex-col h-screen flex-shrink-0 overflow-hidden z-20"
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(99,102,241,0.07) 0%, transparent 60%)',
        }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.5)',
          }}>
            <Zap size={17} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <p className="font-bold text-white text-base leading-none">TaskFlow</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Team Manager</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={!sidebarOpen ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))'
                  : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              })}
            >
              <Icon size={17} className="flex-shrink-0" />
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                  {label}
                </motion.span>
              )}
            </NavLink>
          ))}

          {/* Projects */}
          {sidebarOpen && projects.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-5">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Projects
                </p>
                <NavLink to="/projects" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Plus size={13} />
                </NavLink>
              </div>
              {projects.slice(0, 7).map((p, i) => {
                const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'];
                const c = colors[i % colors.length];
                return (
                  <NavLink key={p._id} to={`/projects/${p._id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 truncate ${
                        isActive ? 'text-white bg-white/10' : 'hover:bg-white/5'
                      }`
                    }
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: c }} />
                    <span className="truncate">{p.title}</span>
                  </NavLink>
                );
              })}
            </motion.div>
          )}
        </nav>

        {/* User footer */}
        <div className="relative p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
            {user && <Avatar name={user.name} avatar={user.avatar} size="sm" className="flex-shrink-0" />}
            {sidebarOpen && user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-none">{user.name}</p>
                <p className="text-xs mt-0.5 capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.role}</p>
              </motion.div>
            )}
            {sidebarOpen && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={handleLogout}
                className="p-1.5 rounded-lg transition-all hover:bg-red-500/20"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                title="Sign out"
              >
                <LogOut size={15} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full flex items-center justify-center transition-colors z-10 shadow-lg"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </motion.aside>
    </AnimatePresence>
  );
};
