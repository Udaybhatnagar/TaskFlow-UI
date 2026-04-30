import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'member']),
});
type FormData = z.infer<typeof schema>;

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'member' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signup(data);
      toast.success('Account created! Welcome to TaskFlow 🎉');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-900 via-brand-800 to-brand-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="relative text-center">
          <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Get started today</h2>
          <p className="text-brand-200 text-lg max-w-xs">Create your workspace and start managing tasks in under 2 minutes.</p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              'Create unlimited projects',
              'Invite team members',
              'Kanban drag & drop',
              'Real-time dashboard',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-brand-200">
                <div className="h-4 w-4 rounded-full bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">TaskFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="signup-name"
              label="Full Name"
              placeholder="Alex Johnson"
              error={errors.name?.message}
              icon={<User size={16} />}
              {...register('name')}
            />
            <Input
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register('email')}
            />
            <div className="relative">
              <Input
                id="signup-password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                icon={<Lock size={16} />}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Select
              id="signup-role"
              label="I want to join as"
              options={[{ value: 'member', label: 'Team Member' }, { value: 'admin', label: 'Admin / Project Manager' }]}
              {...register('role')}
            />
            <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>
          <p className="text-xs text-gray-600 mt-4 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
