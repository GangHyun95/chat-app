import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.ts';
import {
    getMessages,
    sendMessage,
} from '../controllers/message.controller.ts';

const router = express.Router();

router.get('/:id', protectRoute, getMessages);

router.post('/send/:id', protectRoute, sendMessage);

export default router;
