import { create } from 'zustand';
import { User } from '../types/user';

type AuthState = {
    authUser: User | null;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void; 
    setAuthUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    setAuthUser: (user) => set({ authUser: user }),
}));
