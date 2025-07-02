import http from 'http';

import express from 'express';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    },
});

const userSocketMap = new Map();

export function getReceiverSocketId(userId: string) {
    return userSocketMap.get(userId);
}

io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('토큰이 제공되지 않았습니다.');
        return socket.disconnect();
    }

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error('Access token secret is not defined');
        }
        const decoded = jwt.verify(token, secret);
        
        if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
            throw new Error('Invalid token payload');
        }
        const userId = decoded.id;

        if (userId) {
            userSocketMap.set(userId, socket.id);

            io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
        }

        socket.on('disconnect', () => {
            console.log('disconnected', socket.id);
            userSocketMap.delete(userId);
            io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
        });
    } catch (error) {
        console.error('유효하지 않은 토큰:', error);
        return socket.disconnect();
    }
});
export { io, app, server };
