import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const filteredUsers = await User.find({ _id: { $ne: req.user._id } }).select('_id fullName profilePic').lean();
        res.status(200).json({ 
            success: true,
            message: '유저 목록을 성공적으로 불러왔습니다.',
            data: { 
                users: filteredUsers,
            }
        });
    } catch (error) {
        console.error('Error in getUsersForSidebar: ', error.message);
        res.status(500).json({ success:false, message: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
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
        console.error('Error in getMessages controller: ', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
        return res.status(400).json({ success: false, message: '내용이 없습니다.' });
    }
    try {
        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

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
        console.error('Error in sendMessage controller: ', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
