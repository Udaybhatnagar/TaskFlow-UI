import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-violet-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzktOS45NCA4LjA2LTE4IDE4LTE4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative text-center">
          <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
          <p className="text-brand-200 text-lg">Your projects are waiting for you.</p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
            {['Kanban Boards', 'Team Collaboration', 'Analytics', 'Role Management'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-brand-200">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-300" />
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

          <h1 className="text-2xl font-bold text-white mb-1">Sign in to your account</h1>
          <p className="text-gray-400 text-sm mb-8">Don't have an account? <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up free</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register('email')}
            />
            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Your password"
                error={errors.password?.message}
                icon={<Lock size={16} />}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800 text-xs text-gray-500">
            <p className="font-medium text-gray-400 mb-1">Demo credentials</p>
            <p>Admin: <span className="text-gray-300">admin@example.com / admin123</span></p>
            <p>Member: <span className="text-gray-300">sarah@example.com / member123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
