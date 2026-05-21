import cron from 'node-cron';
import { supabase } from '../config/supabase.js';
import { detectPricingChanges } from '../services/pricingDiff.service.js';
import { sendPricingChangeEmail } from '../utils/emailService.js';

export const runPricingCheck = async () => {
  try {
    console.log('[Pricing Monitor] Starting automatic pricing check...');

    // Fetch all active, non-invalidated audits
    const { data: audits, error: auditsError } = await supabase
      .from('audits')
      .select('*, auditor:users(email, name)')
      .eq('invalidated', false);

    if (auditsError) throw auditsError;

    const affectedAudits = [];

    for (const audit of audits || []) {
      if (!audit.pricing_snapshot) continue;

      const diff = await detectPricingChanges(audit.pricing_snapshot);

      if (diff.hasChanges) {
        console.log(`[Pricing Monitor] Audit "${audit.title}" (${audit.id}) is affected by pricing changes.`);

        // Invalidate audit in DB, with fallback for missing timestamp columns
        try {
          const { error } = await supabase
            .from('audits')
            .update({
              invalidated: true,
              invalidated_at: new Date().toISOString(),
              last_checked_at: new Date().toISOString()
            })
            .eq('id', audit.id);

          if (error) {
            // Fall back to just setting invalidated: true
            console.log(`[Pricing Monitor] Timestamp update failed, falling back to basic invalidation.`);
            await supabase
              .from('audits')
              .update({ invalidated: true })
              .eq('id', audit.id);
          }
        } catch (dbErr) {
          console.warn(`[Pricing Monitor] DB update error, attempting fallback basic invalidation...`, dbErr);
          await supabase
            .from('audits')
            .update({ invalidated: true })
            .eq('id', audit.id);
        }

        // Send notification email
        const email = audit.auditor?.email || 'priyanshuroushan002@gmail.com';
        const changesSummary = diff.changes.map(c => 
          `• ${c.tool.replace('_', ' ').toUpperCase()} (${c.plan}): $${c.oldPrice !== null ? c.oldPrice : 'N/A'} → $${c.newPrice !== null ? c.newPrice : 'Removed'}`
        ).join('\n');

        await sendPricingChangeEmail({ email, audit, changesSummary });

        // Insert notification
        try {
          await supabase.from('notifications').insert([
            {
              user_id: audit.auditor_id,
              message: `Pricing changes detected. Audit "${audit.title}" has been marked for revalidation.`,
              is_read: false
            }
          ]);
        } catch (notifErr) {
          console.error('[Pricing Monitor] Failed to persist notification:', notifErr.message);
        }

        affectedAudits.push({
          auditId: audit.id,
          title: audit.title,
          changes: diff.changes
        });
      } else {
        // Just update last checked timestamp, with fallback
        try {
          const { error } = await supabase
            .from('audits')
            .update({
              last_checked_at: new Date().toISOString()
            })
            .eq('id', audit.id);
            
          if (error) {
            // Suppress fallback if column is missing
          }
        } catch (dbErr) {
          // Suppress fallback if column is missing
        }
      }
    }

    console.log(`[Pricing Monitor] Check finished. Invalidated ${affectedAudits.length} audits.`);
    return affectedAudits;
  } catch (error) {
    console.error('[Pricing Monitor] Cron execution failed:', error);
    return [];
  }
};

// Run every hour
cron.schedule('0 * * * *', runPricingCheck);
