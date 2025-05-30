import express from 'express';
import {
    getGoogleClientId,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    signup,
    updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.post('/refresh', refreshAccessToken);

router.post('/google', googleLogin);

router.get('/google', getGoogleClientId);

export default router;
