import express from 'express';
import { detectChanges } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Manual check endpoint
router.post('/detect-changes', authMiddleware, detectChanges);

export default router;
