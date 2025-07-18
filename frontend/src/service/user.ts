import { axiosInstance } from '@/lib/axios';

export const getUsers = async () => {
    const res = await axiosInstance.get('/users', { withAuth: true });
    return res.data;
};

export const getUserByUsername = async (payload: { username: string }) => {
    const { username } = payload;
    const res = await axiosInstance.get(`/users/${username}`, { withAuth: true });
    return res.data;
};

export const updateProfile = async (formData: FormData) => {
    const res = await axiosInstance.patch('/users/me', formData, {
        withAuth: true,
    });

    return res.data;
};