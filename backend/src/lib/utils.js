import jwt from 'jsonwebtoken';

export const generateToken = (id, type) => {
    const secret =
        type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET;

    if (!secret) {
        throw new Error(
            `throw new Error('${type} token secret is not defined');`
        );
    }

    const expiresIn = type === 'access' ? '15m' : '1d';
    return jwt.sign({ id }, secret, {
        expiresIn,
    });
};
