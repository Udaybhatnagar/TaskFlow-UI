import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Bell, X, FolderOpen, CheckSquare } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';

interface TopbarProps { title?: string; }

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const matchedProjects = q ? projects.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)).slice(0, 5) : [];
  const hasResults = matchedProjects.length > 0 || matchedTasks.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar h-16 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              placeholder="Search tasks, projects…"
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              className="pl-9 pr-8 py-2 text-sm rounded-xl w-56 outline-none transition-all duration-200 focus:w-72"
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
              onBlur={e => { if (!e.relatedTarget) setTimeout(() => setOpen(false), 150); }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {open && q && (
            <div className="search-dropdown animate-fade-slide-up" onMouseDown={e => e.preventDefault()}>
              {!hasResults && (
                <div className="p-4 text-sm text-center" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</div>
              )}
              {matchedProjects.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Projects</div>
                  {matchedProjects.map(p => (
                    <button key={p._id} onClick={() => { navigate(`/projects/${p._id}`); setQuery(''); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--bg-elevated)] transition-colors">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        <FolderOpen size={13} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{p.members.length} members</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {matchedTasks.length > 0 && (
                <div className={matchedProjects.length > 0 ? 'border-t' : ''} style={{ borderColor: 'var(--border)' }}>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tasks</div>
                  {matchedTasks.map(t => (
                    <button key={t._id} onClick={() => { setQuery(''); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--bg-elevated)] transition-colors">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <CheckSquare size={13} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StatusBadge status={t.status} />
                          <PriorityBadge priority={t.priority} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-center text-xs" style={{ color: 'var(--text-subtle)' }}>Press Esc to close</p>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button
          className="h-9 w-9 rounded-xl flex items-center justify-center relative transition-all duration-200 hover:scale-105"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
            <Avatar name={user.name} avatar={user.avatar} size="sm" />
            <div className="hidden lg:block">
              <p className="text-xs font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
