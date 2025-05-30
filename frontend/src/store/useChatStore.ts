import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import { useAuthStore } from './useAuthStore';

type ChatState = {
    messages: MessageType[];
    users: UserType[];
    selectedUser: UserType | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (message: MessageType) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
    setSelectedUser: (selectedUser: UserType | null) => void;
};

type MessageType = {
    _id?: string;
    senderId?: string;
    receiverId?: string;
    text: string;
    image: string | null;
    createdAt?: string;
};

type UserType = {
    _id: string;
    email: string;
    profilePic: string;
    fullName: string;
};

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/message/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get(`/message/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post(
                `/message/send/${selectedUser?._id}`,
                messageData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser =
                newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off('newMessage');
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
