'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useAuth() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth, logout } = useAuthStore();
  const router = useRouter();

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        name,
        password,
      });
      setAuth(res.data.user, res.data.token);
      router.push('/chat');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      setAuth(res.data.user, res.data.token);
      router.push('/chat');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { register, login, logout, error, loading };
}
