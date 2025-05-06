import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (!decoded) {
                return res.status(401).json({
                    message: '유효하지 않은 토큰입니다.',
                });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    message: '사용자를 찾을 수 없습니다.',
                });
            }

            req.user = user;

            next();
        } else {
            return res.status(401).json({
                message: '토큰이 제공되지 않았습니다.',
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: '토큰 인증에 실패했습니다.',
        });
    }
};
