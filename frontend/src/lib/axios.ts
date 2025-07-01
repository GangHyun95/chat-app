import axios, { type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/useAuthStore';

declare module 'axios' {
    export interface AxiosRequestConfig {
        withAuth?: boolean;
    }
}

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === 'development'
            ? 'http://localhost:5001/api'
            : '/api',
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.withAuth) {
        const token = useAuthStore.getState().accessToken;
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
});