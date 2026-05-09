import express from 'express';
import { createForm, getForms, submitResponse, getReport } from '../controllers/form.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware(['Admin']), createForm);
router.get('/', getForms);
router.post('/submit', submitResponse);
router.get('/report/:audit_id', getReport);

export default router;
