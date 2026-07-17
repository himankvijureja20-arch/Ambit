import { create } from 'zustand';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'resident' | 'admin';
  trustScore?: number;
  adminApproved: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, firstName: string, lastName: string, inviteCode: string) => Promise<User>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('auth_token'),
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  loading: false,
  error: null,

  signup: async (email, password, firstName, lastName, inviteCode) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        firstName,
        lastName,
        inviteCode,
      });
      // Signup does not return a session token — account is pending admin approval.
      set({ loading: false });
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Signup failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ token, user, loading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ token: null, user: null });
  },

  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token });
  },
}));
