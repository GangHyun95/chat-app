import { create } from 'zustand';

import { Message } from '@/types/message';
import { User } from '@/types/user';

type ChatState = {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    selectedUser: User | null;
    setSelectedUser: (selectedUser: User | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    selectedUser: null,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((prev) => ({ messages: [...prev.messages, message] })),
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
