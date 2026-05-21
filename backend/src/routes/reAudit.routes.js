import express from 'express';
import { rerunAudit } from '../controllers/reAudit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/:auditId', authMiddleware, rerunAudit);

export default router;
