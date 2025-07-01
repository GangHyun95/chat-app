import { axiosInstance } from '../lib/axios';

export const updateProfile = async (formData: FormData) => {
    const res = await axiosInstance.patch('/users/me', formData, {
        withAuth: true,
    });

    return res.data;
};