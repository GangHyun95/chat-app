import { axiosInstance } from '../lib/axios';

export const getMessages = async (payload: { userId: string }) => {
    const { userId } = payload;
    const res = await axiosInstance.get(`/messages`, {
        params: { userId },
        withAuth: true,
    });
    return res.data;
};

export const sendMessage = async (payload: { userId: string; formData: FormData; }) => {
    const { userId, formData } = payload;
    const res = await axiosInstance.post(`/messages/send/${userId}`, formData, {
        withAuth: true
    });

    return res.data;
};