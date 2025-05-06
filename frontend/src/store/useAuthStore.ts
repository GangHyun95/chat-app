import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

const BASE_URL =
    import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

type AuthState = {
    authUser: formData | null;
    accessToken: string | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: string[];
    googleClientId: string;
    checkAuth: () => Promise<void>;
    signup: (data: formData) => Promise<void>;
    googleLogin: (code: string) => Promise<void>;
    getGoogleClientId: () => Promise<void>;
    login: (data: formData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { profilePic: string }) => Promise<void>;
    socket: Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
};

type formData = {
    _id?: string;
    createdAt?: string;
    fullName?: string;
    email: string;
    password: string;
    profilePic?: string;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null,
    accessToken: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    googleClientId: '',

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/refresh-token');
            set({
                authUser: res.data.user,
                accessToken: res.data.accessToken,
            });
            get().connectSocket();
        } catch (error) {
            console.log('Error in checkAuth: ', error);
            set({
                authUser: null,
                accessToken: null,
            });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({
                authUser: res.data.user,
                accessToken: res.data.accessToken,
            });
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
            set({
                authUser: res.data.user,
                accessToken: res.data.accessToken,
            });
            toast.success('로그인되었습니다.');

            get().connectSocket();
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
            set({
                authUser: null,
                accessToken: null,
            });
            toast.success('로그아웃되었습니다.');
            get().disconnectSocket();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },

    googleLogin: async (code: string) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/google-login', {
                code,
            });
            const { accessToken } = res.data;
            if (accessToken) {
                set({ accessToken, authUser: res.data.user });
                toast.success('구글 로그인 성공');
            } else {
                toast.error('구글 로그인 실패');
            }
        } catch (error) {
            console.error('Google 로그인 에러:', error);
            toast.error('Google 로그인 중 문제가 발생했습니다.');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    getGoogleClientId: async () => {
        try {
            const res = await axiosInstance.get('/auth/google-client-id');
            set({ googleClientId: res.data.googleClientId });
        } catch (error) {
            console.log('Error: ', error);
            set({ googleClientId: '' });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data, {
                headers: {
                    Authorization: `Bearer ${get().accessToken}`,
                },
            });
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

    connectSocket: () => {
        const { authUser, accessToken } = get();
        if (!authUser || !accessToken || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            auth: {
                token: accessToken,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
    },
}));
