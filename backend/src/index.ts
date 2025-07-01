import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.route.ts';
import messageRoutes from './routes/message.route.ts';
import userRoutes from './routes/user.route.ts';

import { connectToDB } from './lib/db.ts';
import { app, server } from './lib/socket.ts';
import { protectRoute } from './middleware/auth.middleware.ts';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', protectRoute, messageRoutes);
app.use('/api/users', protectRoute, userRoutes);

app.get('/env.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        window.__ENV__ = {
            GOOGLE_CLIENT_ID: "${process.env.GOOGLE_CLIENT_ID}"
        };
    `);
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log('server is running on PORT:' + PORT);
    connectToDB();
});
