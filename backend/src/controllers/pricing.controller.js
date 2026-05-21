import { getCurrentPricing } from '../services/pricing.service.js';
import { detectPricingChanges } from '../services/pricingDiff.service.js';
import { supabase } from '../config/supabase.js';

export const getPricing = async (req, res) => {
  try {
    const pricing = await getCurrentPricing();
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pricing data' });
  }
};

export const checkAuditPricing = async (req, res) => {
  try {
    const { auditId } = req.params;

    // Fetch audit from Supabase
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('pricing_snapshot')
      .eq('id', auditId)
      .single();

    if (auditError) {
      return res.status(404).json({ error: 'Audit not found or could not be retrieved' });
    }

    const oldSnapshot = audit?.pricing_snapshot;

    // Call detectPricingChanges
    const diff = await detectPricingChanges(oldSnapshot);

    res.json({
      auditId,
      ...diff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
