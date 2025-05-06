import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('토큰이 제공되지 않았습니다.');
        return socket.disconnect();
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;

        if (userId) userSocketMap[userId] = socket.id;

        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        socket.on('disconnect', () => {
            console.log('disconnected', socket.id);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    } catch (error) {
        console.error('유효하지 않은 토큰:', error);
        return socket.disconnect;
    }
});
export { io, app, server };
