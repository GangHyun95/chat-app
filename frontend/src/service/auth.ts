import { axiosInstance } from '@/lib/axios';
import { LoginPayload, SignupPayload } from '@/types/auth';

export const getMe = async () => {
    const res = await axiosInstance.get('/auth/me', { withAuth: true });
    return res.data;
};

export const refreshAccessToken = async () => {
    const res = await axiosInstance.post('/auth/refresh');
    return res.data;
};

export const signup = async (payload: SignupPayload) => {
    const res = await axiosInstance.post('/auth/signup', payload);
    return res.data;
};

export const login = async (payload: LoginPayload) => {
    const res = await axiosInstance.post('/auth/login', payload);
    return res.data;
};

export const logout = async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
};

export const googleLogin = async (payload: { code: string }) => {
    const res = await axiosInstance.post('/auth/google', payload);
    return res.data;
};
