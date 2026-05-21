import express from 'express';
import { getPricing, checkAuditPricing } from '../controllers/pricing.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPricing);
router.get('/check/:auditId', authMiddleware, checkAuditPricing);

export default router;
