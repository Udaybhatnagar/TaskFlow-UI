import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/api/users.api';
import toast from 'react-hot-toast';

const profileSchema = z.object({ name: z.string().min(2, 'Name must be at least 2 characters') });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const { register: rp, handleSubmit: hp, formState: { errors: ep, isSubmitting: isp }, reset: resetProfile } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const { register: rpw, handleSubmit: hpw, formState: { errors: epw, isSubmitting: ispw }, reset: resetPw } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    const updated = await usersApi.updateProfile(data);
    setUser(updated);
    toast.success('Profile updated!');
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await usersApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPw();
    } catch (err: unknown) {
      toast.error((err as any)?.response?.data?.message || 'Failed to change password');
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-800">
          <Avatar name={user.name} avatar={user.avatar} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <span className={`badge mt-2 capitalize ${user.role === 'admin' ? 'badge-high' : 'badge-todo'}`}>{user.role}</span>
          </div>
        </div>

        <form onSubmit={hp(onProfileSubmit)} className="space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2"><User size={15} className="text-brand-400" /> Personal Info</h3>
          <Input id="profile-name" label="Full Name" error={ep.name?.message} {...rp('name')} />
          <Input id="profile-email" label="Email" value={user.email} disabled className="opacity-60 cursor-not-allowed" />
          <Button type="submit" loading={isp} size="sm"><Save size={14} /> Save Changes</Button>
        </form>
      </motion.div>

      {/* Password card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <form onSubmit={hpw(onPasswordSubmit)} className="space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2"><Lock size={15} className="text-brand-400" /> Change Password</h3>
          <Input id="current-password" label="Current Password" type="password" error={epw.currentPassword?.message} {...rpw('currentPassword')} />
          <Input id="new-password" label="New Password" type="password" error={epw.newPassword?.message} {...rpw('newPassword')} />
          <Input id="confirm-password" label="Confirm New Password" type="password" error={epw.confirmPassword?.message} {...rpw('confirmPassword')} />
          <Button type="submit" loading={ispw} size="sm"><Save size={14} /> Update Password</Button>
        </form>
      </motion.div>
    </div>
  );
};
