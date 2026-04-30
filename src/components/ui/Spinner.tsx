import React from 'react';
import { cn } from '@/utils/cn';

export const Spinner: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className, size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <svg className={cn('animate-spin text-indigo-500', sizes[size], className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-base)' }}>
    <div className="text-center">
      <div className="relative mx-auto mb-5 h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute inset-3 rounded-full" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', opacity: 0.2 }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl p-4 animate-pulse" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
    <div className="h-3 rounded-full w-3/4 mb-3" style={{ background: 'var(--bg-card)' }} />
    <div className="h-2.5 rounded-full w-1/2 mb-4" style={{ background: 'var(--bg-card)' }} />
    <div className="flex gap-2">
      <div className="h-5 rounded-full w-16" style={{ background: 'var(--bg-card)' }} />
      <div className="h-5 rounded-full w-12" style={{ background: 'var(--bg-card)' }} />
    </div>
  </div>
);
