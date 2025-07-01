import { useEffect } from 'react';

import { useSocket } from '@/hooks/useSocket';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message';

export function useMessagesSubscription() {
    const { socket } = useSocket();
    const selectedUser = useChatStore(state => state.selectedUser);
    const messages = useChatStore(state => state.messages);
    const setMessages = useChatStore(state => state.setMessages);

    useEffect(() => {
        if (!socket || !selectedUser) return;

        const handler = (newMessage: Message) => {
            const isFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isFromSelectedUser) return;
            setMessages([...messages, newMessage]);
        };

        socket.on('newMessage', handler);

        return () => {
            socket.off('newMessage', handler);
        };
    }, [socket, selectedUser, messages]);
}
