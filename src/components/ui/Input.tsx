import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, id, ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="label">{label}</label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <input
        id={id}
        className={cn('input-field', icon && 'pl-10', error && '!border-rose-500/60 focus:!ring-rose-500/30', className)}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="label">{label}</label>}
    <textarea
      id={id}
      className={cn('input-field resize-none', error && '!border-rose-500/60', className)}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, id, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="label">{label}</label>}
    <select
      id={id}
      className={cn('input-field', error && '!border-rose-500/60', className)}
      style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
      {...props}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
  </div>
);
