import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import jwt from 'jsonwebtoken';
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
            const accessToken = generateToken(newUser._id, 'access');
            const refreshToken = generateToken(newUser._id, 'refresh');

            res.cookie('chatapp_refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            await newUser.save();

            res.status(201).json({
                accessToken,
                user: {
                    ...newUser._doc,
                    password: '',
                },
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

        const accessToken = generateToken(user._id, 'access');
        const refreshToken = generateToken(user._id, 'refresh');

        res.cookie('chatapp_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken,
            user: {
                ...user._doc,
                password: '',
            },
        });
    } catch (error) {
        console.log('로그인 중 오류 발생:', error.message);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('chatapp_refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
        console.log('로그아웃 중 오류 발생:', error.message);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const googleLogin = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            message: 'Google 로그인 코드가 필요합니다.',
        });
    }

    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
                grant_type: 'authorization_code',
            }).toString(),
        });

        if (!tokenRes.ok) {
            res.status(400).json({
                success: false,
                message: 'Google 토큰 요청에 실패했습니다.',
            });
            return;
        }

        const tokenData = await tokenRes.json();
        const { access_token } = tokenData;

        if (!access_token) {
            return res.status(400).json({
                message: 'Google Access Token을 가져오지 못했습니다.',
            });
        }

        const userInfoRes = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        if (!userInfoRes.ok) {
            return res.status(400).json({
                message: 'Google 사용자 정보 요청에 실패했습니다.',
            });
        }
        const userInfo = await userInfoRes.json();
        const { sub: googleId, email, name, picture } = userInfo;

        if (!googleId || !email) {
            res.status(400).json({
                success: false,
                message: 'Google 사용자 정보가 유효하지 않습니다.',
            });
            return;
        }

        let user = await User.findOne({ googleId });
        if (!user) {
            const emailOwner = await User.findOne({ email });
            if (emailOwner) {
                res.status(400).json({
                    success: false,
                    message: '이미 해당 이메일로 가입된 계정이 있습니다.',
                });
                return;
            }
            user = new User({
                email,
                fullName: name,
                googleId,
                profilePic: picture,
            });

            await user.save();
        }

        const accessToken = generateToken(user._id, 'access');
        const refreshToken = generateToken(user._id, 'refresh');

        res.cookie('chatapp_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken,
            user: {
                ...user._doc,
                password: '',
            },
        });
    } catch (error) {
        console.error('Google 로그인 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getGoogleClientId = async (req, res) => {
    try {
        res.status(200).json({
            googleClientId: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (error) {
        console.error('Google Client ID 가져오기 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
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

        res.status(200).json({ ...updatedUser._doc, password: '' });
    } catch (error) {
        console.log(error);
        console.log('프로필 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies['chatapp_refresh_token'];
    try {
        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh Token이 없습니다. 다시 로그인해주세요.',
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        if (!decoded) {
            return res.status(403).json({
                message: 'Refresh Token이 유효하지 않습니다.',
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: '사용자를 찾을 수 없습니다.',
            });
        }

        const newAccessToken = generateToken(user._id, 'access');
        res.status(200).json({
            accessToken: newAccessToken,
            user: {
                ...user._doc,
                password: '',
            },
        });
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};
