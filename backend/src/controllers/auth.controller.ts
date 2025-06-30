import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';
import { generateToken } from '../lib/utils.ts';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id).select('-password').lean();
        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: '유저 정보를 가져왔습니다.',
            data: { user },
        })
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        res.status(400).json({ success: false, message: '모든 필수 항목을 입력해 주세요.' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' });
        return;
    }

    try {
        const exists = await User.exists({ email });

        if (exists) {
            res.status(400).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hash });

        await newUser.save();
        
        const accessToken = generateToken(newUser._id, 'access');
        const refreshToken = generateToken(newUser._id, 'refresh');

        res.cookie('chatapp_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            data: {
                accessToken,
            }
        });
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('_id password');

        if (!user) {
            res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            return;
        }

        if (!user.password) {
            res.status(400).json({ success: false, message: '비밀번호가 설정되지 않은 계정입니다.' });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            return;
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
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie('chatapp_refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ 
            success: true,
            message: '성공적으로 로그아웃되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ success: false, message: 'Google 로그인 코드가 필요합니다.' });
        return;
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

        const { access_token } = await tokenRes.json();

        if (!access_token) {
            res.status(400).json({ success:false, message: 'Google Access Token을 가져오지 못했습니다.' });
            return;
        }

        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userInfoRes.ok) {
            res.status(400).json({ success: false, message: 'Google 사용자 정보 요청에 실패했습니다.' });
            return;
        }

        const { sub: googleId, email, name, picture } = await userInfoRes.json();

        if (!googleId || !email) {
            res.status(400).json({ success: false, message: 'Google 사용자 정보가 유효하지 않습니다.' });
            return;
        }

        let user = await User.findOne({ googleId }).select('_id');
        if (!user) {
            const emailExists = await User.exists({ email });
            if (emailExists) {
                res.status(400).json({ success: false, message: '이미 해당 이메일로 가입된 계정이 있습니다.' });
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
            success: true,
            data: {
                accessToken,
            },
        });
    } catch (error) {
        console.error('Google 로그인 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies['chatapp_refresh_token'];
    try {
        if (!refreshToken) {
            res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
            return;
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) throw new Error('Refresh token secret is not defined');

        const decoded = jwt.verify(refreshToken, secret);
        if (typeof decoded !== 'object' || !('id' in decoded)) {
            res.status(403).json({ success: false, message: 'Refresh Token이 유효하지 않습니다.' });
            return;
        }

        const user = await User.findById(decoded.id).select('_id').lean();
        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        const newAccessToken = generateToken(user._id, 'access');
        res.status(200).json({
            success: true,
            message: 'Access token이 갱신되었습니다.',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};
