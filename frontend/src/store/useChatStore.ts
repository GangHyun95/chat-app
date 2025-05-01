import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

type ChatState = {
    messages: MessageType[];
    users: UserType[];
    selectedUser: UserType | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: (selectedUser: UserType) => void;
};

type MessageType = {
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
};

type UserType = {
    _id: string;
    email: string;
    profilePic: string;
    fullName: string;
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            set({ users: res.data });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
