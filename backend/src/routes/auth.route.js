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

router.get('/refresh-token', refreshAccessToken);

router.post('/google-login', googleLogin);

router.get('/google-client-id', getGoogleClientId);

export default router;
