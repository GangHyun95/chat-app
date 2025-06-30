import jwt from 'jsonwebtoken';
import User from '../models/user.model.ts';
import type { NextFunction, Request, Response } from 'express';

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];

            const secret = process.env.ACCESS_TOKEN_SECRET;
            if (!secret) {
                throw new Error('Access token secret is not defined');
            }
            const decoded = jwt.verify(token, secret);

            if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
                res.status(401).json({
                    success: false,
                    message: '로그인이 필요합니다.',
                });
                return;
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
                return;
            }

            req.user = user;

            next();
        } else {
            res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
            return;
        }
    } catch (error) {
        res.status(401).json({ message: '토큰 인증에 실패했습니다.' });
        return;
    }
};
