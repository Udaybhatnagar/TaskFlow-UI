import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy · h:mm a');
};

export const timeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (dueDate: string | Date): boolean => {
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isAfter(new Date(), d);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-violet-600', 'bg-blue-600', 'bg-emerald-600',
    'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};
