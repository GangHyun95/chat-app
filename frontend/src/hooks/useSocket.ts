import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/useAuthStore';

export const useSocket = () => {
    const authUser = useAuthStore(state => state.authUser);
    const accessToken = useAuthStore(state => state.accessToken);
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!authUser || !accessToken || socketRef.current?.connected) return;
        const url = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';
        const socket = io(url, { auth: { token: accessToken }});
        socket.connect();
        socketRef.current = socket;

        socket.on('getOnlineUsers', (userIds: string[]) => {
            setOnlineUsers(userIds);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setOnlineUsers([]);
        };
    }, [authUser, accessToken])

    return {
        socket: socketRef.current,
        onlineUsers,
    }
};