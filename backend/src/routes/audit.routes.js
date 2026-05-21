import express from 'express';
import { createAudit, getAudits, getAuditById, updateAuditStatus, deleteAudit, getAuditReport, getPublicAudit, getPublicAuditByShareToken } from '../controllers/audit.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/public/:id', getPublicAudit);
router.get('/share/:shareToken', getPublicAuditByShareToken);

router.use(authMiddleware);

router.post('/', createAudit);
router.get('/', getAudits);
router.get('/:id', getAuditById);
router.get('/:id/report', getAuditReport);
router.put('/:id/status', roleMiddleware(['Admin', 'Auditor']), updateAuditStatus);
router.delete('/:id', roleMiddleware(['Admin']), deleteAudit);

export default router;
