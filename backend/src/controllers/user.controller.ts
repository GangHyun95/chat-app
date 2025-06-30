import type { Request, Response } from 'express';
import cloudinary from '../lib/cloudinary.ts';
import User from '../models/user.model.ts';

export const getUsersForSidebar = async (req: Request, res: Response) => {
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
        console.error('Error in getUsersForSidebar: ', error);
        res.status(500).json({ success:false, message: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: '프로필 사진이 필요합니다. '});
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true, select: '-password' }
        ).lean();

        res.status(200).json({
            success: true,
            message: '프로필 사진이 업데이트 되었습니다.',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        console.error('프로필 업데이트 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};