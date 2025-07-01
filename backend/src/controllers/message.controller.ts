import type { Request, Response } from 'express';
import { uploadAndReplaceImage } from '../lib/cloudinary.ts';
import { getReceiverSocketId, io } from '../lib/socket.ts';
import Message from '../models/message.model.ts';

export const getMessages = async (req: Request, res: Response) => {
    const myId = req.user._id;
    const userToChatId = req.query.userId;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
        .sort({ createdAt: 1 })
        .lean();
        
        res.status(200).json({ 
            success: true,
            message: '메시지를 성공적으로 불러왔습니다.',
            data: { messages }
        });
    } catch (error) {
        console.error('Error in getMessages controller: ', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    const { text } = req.body;
    const file = req.file;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !file) {
        res.status(400).json({ success: false, message: '내용이 없습니다.' });
        return;
    }
    try {
        let uploadImgUrl = null;
        if (file) {
            uploadImgUrl = await uploadAndReplaceImage(null, file.path);
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: uploadImgUrl,
        });

        const plainMessage = newMessage.toObject();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', plainMessage);
        }
        res.status(201).json({
            success: true,
            message: '메시지를 성공적으로 보냈습니다.',
            data: { message: plainMessage },
        });
    } catch (error) {
        console.error('Error in sendMessage controller: ', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
