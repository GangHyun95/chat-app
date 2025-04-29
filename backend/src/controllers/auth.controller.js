import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

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

export const login = (req, res) => {
    res.send('login route');
};

export const logout = (req, res) => {
    res.send('logout route');
};
