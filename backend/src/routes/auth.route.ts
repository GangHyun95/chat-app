import express from 'express';
import {
    getMe,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    signup,
} from '../controllers/auth.controller.ts';
import { protectRoute } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/me', protectRoute, getMe);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshAccessToken);

router.post('/google', googleLogin);

export default router;
