import { reRunAuditService } from '../services/reAudit.service.js';

export const rerunAudit = async (req, res) => {
  try {
    const { auditId } = req.params;
    
    if (!auditId) {
      return res.status(400).json({ error: 'Audit ID parameter is required' });
    }

    const result = await reRunAuditService(auditId);
    res.json(result);
  } catch (error) {
    console.error('Re-audit error:', error);
    res.status(500).json({ error: error.message || 'Failed to re-run audit' });
  }
};
