import express from 'express';

import { getUserByUsername, getUsersForSidebar, updateProfile } from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/', getUsersForSidebar);
router.patch('/me',  upload.single('img'), updateProfile);
router.get('/:username', getUserByUsername);

export default router;