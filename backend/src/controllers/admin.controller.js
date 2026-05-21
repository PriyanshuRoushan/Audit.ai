import { runPricingCheck } from '../cron/pricingMonitor.cron.js';

export const detectChanges = async (req, res) => {
  try {
    const affected = await runPricingCheck();
    res.json({
      success: true,
      message: 'Pricing check executed manually.',
      affectedAudits: affected
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to detect changes' });
  }
};
