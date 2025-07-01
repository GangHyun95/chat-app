import express from 'express';
import { getUsersForSidebar, updateProfile } from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.patch('/me',  upload.single('img'), updateProfile);

router.get('/', getUsersForSidebar);

export default router;