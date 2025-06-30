import express from 'express';
import { getUsersForSidebar, updateProfile } from '../controllers/user.controller.ts';

const router = express.Router();

router.patch('/me', updateProfile);
router.get('/', getUsersForSidebar);

export default router;