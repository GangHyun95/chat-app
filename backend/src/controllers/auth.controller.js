import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res
                .status(400)
                .json({ message: '모든 필수 항목을 입력해 주세요.' });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ message: '이미 사용 중인 이메일입니다.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hash,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({
                message: '회원가입에 실패했습니다. 다시 시도해 주세요.',
            });
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error.message);
        res.status(500).json({
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log('로그인 중 오류 발생:', error.message);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
        });
        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
        console.log('로그아웃 중 오류 발생:', error.message);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res
                .status(400)
                .json({ message: '프로필 사진이 필요합니다.' });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadResponse.secure_url,
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log('프로필 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('인증 확인 중 오류 발생:', error.message);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
