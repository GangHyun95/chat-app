import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/', getMessages);

router.post('/send/:id',upload.single('img'), sendMessage);

export default router;
