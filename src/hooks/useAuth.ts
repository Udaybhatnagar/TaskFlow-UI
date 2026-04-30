import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';

export const useAuth = () => {
  const { user, isAuthenticated, accessToken, refreshToken, setAuth, logout } = useAuthStore();

  const signupFn = async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await authApi.signup(data);
    setAuth(res.user, res.accessToken, res.refreshToken);
    return res;
  };

  const loginFn = async (data: { email: string; password: string }) => {
    const res = await authApi.login(data);
    setAuth(res.user, res.accessToken, res.refreshToken);
    return res;
  };

  const logoutFn = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      logout();
    }
  };

  return { user, isAuthenticated, accessToken, signup: signupFn, login: loginFn, logout: logoutFn };
};
