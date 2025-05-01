import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type AuthState = {
    authUser: formData | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: string[]
    checkAuth: () => Promise<void>;
    signup: (data: formData) => Promise<void>;
    login: (data: formData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { profilePic: string }) => Promise<void>;
};

type formData = {
    createdAt?: string;
    fullName?: string;
    email: string;
    password: string;
    profilePic?: string;
};

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log('Error in checkAuth: ', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success('회원가입이 완료되었습니다!');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success('로그인되었습니다.');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('로그아웃되었습니다.');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('프로필 사진이 업데이트되었습니다.');
        } catch (error) {
            console.log('error in update profile', error);
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));
