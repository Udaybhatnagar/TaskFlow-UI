import React from 'react';
import { cn } from '@/utils/cn';
import { getInitials, getAvatarColor } from '@/utils/formatters';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { xs: 'h-6 w-6 text-xs', sm: 'h-8 w-8 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base', xl: 'h-16 w-16 text-xl' };

export const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = 'md', className }) => {
  if (avatar) {
    return <img src={avatar} alt={name} className={cn('rounded-full object-cover ring-2 ring-gray-800', sizes[size], className)} />;
  }
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold text-white ring-2 ring-gray-800 flex-shrink-0', getAvatarColor(name), sizes[size], className)}>
      {getInitials(name)}
    </div>
  );
};

interface AvatarGroupProps {
  users: { name: string; avatar?: string }[];
  max?: number;
  size?: AvatarProps['size'];
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 4, size = 'sm' }) => {
  const shown = users.slice(0, max);
  const rest = users.length - max;
  return (
    <div className="flex -space-x-2">
      {shown.map((u, i) => (
        <Avatar key={i} name={u.name} avatar={u.avatar} size={size} />
      ))}
      {rest > 0 && (
        <div className={cn('rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 ring-2 ring-gray-800', sizes[size])}>
          +{rest}
        </div>
      )}
    </div>
  );
};
